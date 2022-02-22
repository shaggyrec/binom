import { call, delay, ForkEffect, put, takeEvery, takeLatest } from '@redux-saga/core/effects';
import * as subscriptionsActions from '../ducks/subscriptions';
import * as applicationActions from '../ducks/application';
import { apiRequest } from './index';
import { getApiErrorMessage, goToYoomoney } from '../functions';

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


function* buyProcess({ payload: topics }): IterableIterator<any> {
    yield delay(1000);
    try {
        goToYoomoney(yield call(apiRequest, '/api/subscription', 'POST', topics ));
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
    yield takeLatest(subscriptionsActions.buy, buyProcess);
}