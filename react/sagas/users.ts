import { call, ForkEffect, put, select, takeEvery } from '@redux-saga/core/effects';
import * as usersActions from '../ducks/users';
import * as applicationActions from '../ducks/application';
import { apiRequest } from './index';
import { getApiErrorMessage } from '../functions';
import { User } from '../dataTypes/user';

function* requestMeProcess(): IterableIterator<any> {
    try {
        const user = yield call(apiRequest,  '/api/me');
        yield put(usersActions.setMe(user));
    } catch (e) {
        yield put(usersActions.error(getApiErrorMessage(e)));
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
    yield put(applicationActions.setLoading(false));
}

function* updateProcess({ payload: { id, data } }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/user/' + id, 'PUT', data);
        const me: User = yield select(usersActions.getMe);
        if (id === me.id) {
            yield put(usersActions.setMe({ ...me, ...data }))
        }
        yield put(usersActions.success());
    } catch (e) {
        console.log(e);
        yield put(usersActions.error(getApiErrorMessage(e)));
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
}


export function* users(): IterableIterator<ForkEffect> {
    yield takeEvery(usersActions.requestMe, requestMeProcess);
    yield takeEvery(usersActions.update, updateProcess);
}