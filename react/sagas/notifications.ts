import { call, ForkEffect, put, select, takeEvery } from '@redux-saga/core/effects';

import * as notificationsActions from '../ducks/notifications';
import { apiRequest } from './index';
import { getApiErrorMessage } from '../functions';
import { UserNotification } from '../dataTypes/notification';

function* requestListProcess({ payload: { limit, offset } }): IterableIterator<any> {
    try {
        const list: any[] = yield call(apiRequest, `/api/notification?limit=${limit}&offset=${offset}`);
        if (list.length === 0) {
            yield put(notificationsActions.setNoMore());
            return;
        }
        const currentList: UserNotification[] = yield select(notificationsActions.currentList);
        yield put(notificationsActions.list(list.filter(newNotification => !currentList.find(n => newNotification.id === n.id))));
    } catch (e) {
        yield put(notificationsActions.error(getApiErrorMessage(e)));
    }
}

function* setViewedProcess({ payload }): IterableIterator<any> {
    try {
        yield call(apiRequest, `/api/notification/${payload}/viewed`, 'PATCH');
        const currentList: UserNotification[] = yield select(notificationsActions.currentList);
        yield put(notificationsActions.list(currentList.map(n => n.id === payload ? { ...n, viewed: true } : n)))
    } catch (e) {
        console.log(e);
        yield put(notificationsActions.error(getApiErrorMessage(e)));
    }
}

export function* notifications(): IterableIterator<ForkEffect> {
    yield takeEvery(notificationsActions.requestList, requestListProcess);
    yield takeEvery(notificationsActions.setViewed, setViewedProcess);
}