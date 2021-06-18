import { ForkEffect, takeEvery, call, put } from '@redux-saga/core/effects';
import { AxiosResponse } from 'axios';

import * as topicsActions from '../ducks/topics';
import { serverRequest } from '../functions';
import { apiRequest } from './index';


function* requestListProcess(): IterableIterator<any> {
    try {
        const { data }: AxiosResponse = yield call(apiRequest,'/api/topic/list');
        yield put(topicsActions.topics(data));
    } catch (e) {
        yield put(topicsActions.error(e.message))
    }
}

export function* topics(): IterableIterator<ForkEffect> {
    yield takeEvery(topicsActions.requestList, requestListProcess);
}