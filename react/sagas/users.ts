import { call, ForkEffect, put, takeEvery } from '@redux-saga/core/effects';
import * as usersActions from '../ducks/users';
import * as applicationActions from '../ducks/application';
import { apiRequest } from './index';

function* requestMeProcess(): IterableIterator<any> {
    try {
        const user = yield call(apiRequest,  '/api/me');
        yield put(usersActions.setMe(user));
    } catch (e) {
        yield put(usersActions.error(e.message));
    }
    yield put(applicationActions.setLoading(false));
}

export function* users(): IterableIterator<ForkEffect> {
    yield takeEvery(usersActions.requestMe, requestMeProcess);
}