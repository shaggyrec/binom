import { ForkEffect, takeEvery, select, call, put } from '@redux-saga/core/effects';
import { validate as uuidValidate } from 'uuid';
import * as authActions from '../ducks/auth';
import * as usersActions from '../ducks/users';
import * as notificationsActions from '../ducks/notifications';
import { serverRequest } from '../functions';
import { AxiosResponse } from 'axios';
import { eraseTokens, getTokens, storeTokens } from '../tokens';
import { push } from 'connected-react-router';


function* sendEmailProcess(): IterableIterator<any> {
    const email = yield select(authActions.email);
    try {
        const { data }: AxiosResponse = yield call(serverRequest, '/api/auth/email', 'post', { email });
        yield put(authActions.setCodeId(data.id));
    } catch (e) {
        yield put(authActions.error(e.message));
    }
}

function* sendCodeProcess(): IterableIterator<any> {
    const codeId = yield select(authActions.codeId);
    const code: string = yield select(authActions.code);
    if (!uuidValidate(codeId)) {
        location.href = '/auth';
        return
    }
    if (!code || code.length !== 6) {
        return;
    }
    try {
        const { data: { tokens: { accessToken, refreshToken }, user } }: AxiosResponse = yield call(serverRequest, '/api/auth/code', 'post', { id: codeId, code });
        storeTokens(accessToken, refreshToken);
        yield put(usersActions.setMe(user));
        yield put(notificationsActions.requestList());
        yield put(push(yield select(authActions.from)));
    } catch (e) {
        yield put(authActions.error(e.message));
    }
}

export function* refreshTokenProcess(): IterableIterator<any> {
    const [at, rt] = getTokens();
    if (!at || !rt) {
        yield put(push('/auth'));
        return;
    }
    try {
        const {
            data: {
                accessToken,
                refreshToken
            }
        }: AxiosResponse = yield call(serverRequest, '/api/auth/refresh', 'post', { refreshToken: rt });
        storeTokens(accessToken, refreshToken);
    } catch (e) {
        eraseTokens();
        yield put(authActions.error(e.message));
        yield put(push('/auth'));
    }
}

function* logoutProcess(): IterableIterator<any> {
    eraseTokens();
    location.href = '/auth';
}

export function* auth(): IterableIterator<ForkEffect> {
    yield takeEvery(authActions.sendEmail, sendEmailProcess);
    yield takeEvery(authActions.sendCode, sendCodeProcess);
    yield takeEvery(authActions.refreshTokens, refreshTokenProcess);
    yield takeEvery(authActions.logout, logoutProcess);
}