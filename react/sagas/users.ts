import { call, ForkEffect, put, takeEvery } from '@redux-saga/core/effects';
import * as usersActions from '../ducks/users';
import { AxiosResponse } from 'axios';
import { serverRequest } from '../functions';

function* requestMeProcess(): IterableIterator<any> {
    try {
        const { data: user }: AxiosResponse = yield call(serverRequest, '/api/me');
        yield put(usersActions.setMe(user));
    } catch (e) {
        yield put(usersActions.error(e.message));
    }
}

export function* users(): IterableIterator<ForkEffect> {
    yield takeEvery(usersActions.requestMe, requestMeProcess);
}