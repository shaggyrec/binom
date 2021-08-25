import { call, ForkEffect, put, select, takeEvery } from '@redux-saga/core/effects';
import * as subscriptionsActions from '../ducks/subscriptions';
import * as applicationActions from '../ducks/application';
import { apiRequest } from './index';
import { getApiErrorMessage } from '../functions';

function* requestListProcess(): IterableIterator<any> {
    try {
        const subscriptions = yield call(apiRequest,'/api/subscription');
        yield put(subscriptionsActions.setList(subscriptions));
    } catch (e) {
        const error = getApiErrorMessage(e);
        yield put(subscriptionsActions.error(error));
        yield put(applicationActions.error(error));
    }
}

function* createProcess({ payload }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/subscription', 'post', payload);
        yield put(subscriptionsActions.requestList());
    } catch (e) {
        const error = getApiErrorMessage(e);
        yield put(subscriptionsActions.error(error));
        yield put(applicationActions.error(error));
    }
}

function* updateProcess({ payload: { id, subscription } }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/subscription/' + id, 'put', subscription);
        yield put(subscriptionsActions.success());
    } catch (e) {
        console.log(e);
        const error = getApiErrorMessage(e);
        yield put(subscriptionsActions.error(error));
        yield put(applicationActions.error(error));
    }
}

export function* subscriptions(): IterableIterator<ForkEffect> {
    yield takeEvery(subscriptionsActions.requestList, requestListProcess);
    yield takeEvery(subscriptionsActions.create, createProcess);
    yield takeEvery(subscriptionsActions.update, updateProcess);
}