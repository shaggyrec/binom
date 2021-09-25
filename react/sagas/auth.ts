import { ForkEffect, takeEvery, select, call, put, takeLatest, delay } from '@redux-saga/core/effects';
import { validate as uuidValidate } from 'uuid';
import * as authActions from '../ducks/auth';
import * as usersActions from '../ducks/users';
import * as notificationsActions from '../ducks/notifications';
import { getApiErrorMessage, serverRequest } from '../functions';
import { AxiosResponse } from 'axios';
import { eraseTokens, getTokenExpired, getTokens, storeTokens } from '../tokens';
import { push } from 'connected-react-router';
import { ApiErrors } from '../ApiErrors';
import { requestMe } from '../ducks/users';


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
        const { data: { tokens: { accessToken, refreshToken, accessTokenExpired }, user } }: AxiosResponse = yield call(serverRequest, '/api/auth/code', 'post', { id: codeId, code });
        storeTokens(accessToken, refreshToken, accessTokenExpired);
        yield put(usersActions.setMe(user));
        yield put(notificationsActions.requestList());
        yield put(push(yield select(authActions.from)));
    } catch (e) {
        yield put(authActions.error(e.response?.data?.code === ApiErrors.ErrorInvalidAuthCode ? 'Неверный код' : getApiErrorMessage(e)));
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
                refreshToken,
                accessTokenExpired
            }
        }: AxiosResponse = yield call(serverRequest, '/api/auth/refresh', 'post', { refreshToken: rt });
        storeTokens(accessToken, refreshToken, accessTokenExpired);
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

function* checkTokenProcess(): IterableIterator<any> {
    const FIVE_MINUTES = 300000;
    yield delay(2000);
    const accessTokenExpired = getTokenExpired();
    if (!accessTokenExpired) {
        yield delay(FIVE_MINUTES);
        yield put(authActions.checkToken());
        return
    }
    const fromNow = accessTokenExpired - +new Date();
    if (fromNow > 0) {
        yield delay(fromNow)
        yield put(authActions.checkToken());
        return
    }
    yield put(usersActions.requestMe());
    yield delay(FIVE_MINUTES);
    yield put(authActions.checkToken());
}

export function* auth(): IterableIterator<ForkEffect> {
    yield takeEvery(authActions.sendEmail, sendEmailProcess);
    yield takeEvery(authActions.sendCode, sendCodeProcess);
    yield takeEvery(authActions.refreshTokens, refreshTokenProcess);
    yield takeEvery(authActions.logout, logoutProcess);
    yield takeLatest(authActions.checkToken, checkTokenProcess);
}