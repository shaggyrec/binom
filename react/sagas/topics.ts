import { ForkEffect, takeEvery, call, put } from '@redux-saga/core/effects';

import * as topicsActions from '../ducks/topics';
import * as applicationActions from '../ducks/application';
import { apiRequest } from './index';
import { push } from 'connected-react-router';
import { Topic } from '../dataTypes/topic';


function* requestListProcess(): IterableIterator<any> {
    try {
        const topics = yield call(apiRequest,'/api/topic/list');
        yield put(topicsActions.topics(topics));
    } catch (e) {
        yield put(topicsActions.error(e.message))
    }
}

function* requestProcess({ payload: alias }): IterableIterator<any> {
    try {
        yield put(topicsActions.topics(yield put(topicsActions.topic(yield call(apiRequest, '/api/topic/' + alias)))));
    } catch (e) {
        yield put(topicsActions.error(e.message));
    }
}

function* createProcess({ payload: { name, alias } }): IterableIterator<any> {
    try {
        const topic: Topic = yield call(apiRequest, '/api/topic', 'post', { name, alias });
        yield put(topicsActions.topic(topic));
        yield put(push('/topic/' + topic.alias));
    } catch (e) {
        yield put(applicationActions.message(e.message));
        yield put(topicsActions.error(e.message));
    }
}

function* updateProcess({ payload }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/topic', 'put', { id: payload });
        yield call(topicsActions.requestList());
    } catch (e) {
        yield put(applicationActions.message(e.message));
        yield put(topicsActions.error(e.message));
    }
}
function* removeProcess({ payload }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/topic', 'delete', { id: payload });
        yield call(topicsActions.requestList());
    } catch (e) {
        yield put(applicationActions.message(e.message));
        yield put(topicsActions.error(e.message));
    }
}

export function* topics(): IterableIterator<ForkEffect> {
    yield takeEvery(topicsActions.requestList, requestListProcess);
    yield takeEvery(topicsActions.request, requestProcess);
    yield takeEvery(topicsActions.create, createProcess);
    yield takeEvery(topicsActions.update, updateProcess);
    yield takeEvery(topicsActions.remove, removeProcess);
}