import { call, ForkEffect, put, takeEvery } from '@redux-saga/core/effects';

import * as notificationsActions from '../ducks/notifications';
import { apiRequest } from './index';
import { getApiErrorMessage } from '../functions';

function* requestListProcess(): IterableIterator<any> {
    try {
        const list = yield call(apiRequest, '/api/notification');
        yield put(notificationsActions.list(list));
    } catch (e) {
        yield put(notificationsActions.error(getApiErrorMessage(e)));
    }
}

export function* notifications(): IterableIterator<ForkEffect> {
    yield takeEvery(notificationsActions.requestList, requestListProcess);
}