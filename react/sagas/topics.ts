import { ForkEffect, takeEvery, call, put } from '@redux-saga/core/effects';

import * as topicsActions from '../ducks/topics';
import { apiRequest } from './index';


function* requestListProcess(): IterableIterator<any> {
    try {
        const topics = yield call(apiRequest,'/api/topic/list');
        yield put(topicsActions.topics(topics));
    } catch (e) {
        yield put(topicsActions.error(e.message))
    }
}

export function* topics(): IterableIterator<ForkEffect> {
    yield takeEvery(topicsActions.requestList, requestListProcess);
}