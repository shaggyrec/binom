import { ForkEffect, takeEvery, call, put } from '@redux-saga/core/effects';
import axios, { AxiosResponse } from 'axios';

import * as topicsActions from '../ducks/topics';

function* requestListProcess(): IterableIterator<any> {
    try {
        const { data }: AxiosResponse = yield call(axios.get, '/api/topics');
        yield put(topicsActions.topics(data));
    } catch (e) {
        yield put(topicsActions.error(e.message))
    }
}

export function* topics(): IterableIterator<ForkEffect> {
    yield takeEvery(topicsActions.requestList, requestListProcess);
}