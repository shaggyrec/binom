import { ForkEffect, takeEvery, call, put, select } from '@redux-saga/core/effects';

import * as topicsActions from '../ducks/topics';
import * as applicationActions from '../ducks/application';
import { apiRequest } from './index';
import { push } from 'connected-react-router';
import { Topic } from '../dataTypes/topic';

function* afterwards() {
    yield put(topicsActions.requestList());
    yield put(topicsActions.error(null));
}

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
        yield put(topicsActions.topic(yield call(apiRequest, '/api/topic/' + alias)));
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
        yield put(applicationActions.error(e.message));
        yield put(topicsActions.error(e.message));
    }
    yield afterwards();
}

function* updateProcess({ payload: { id, topic } }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/topic/' + id, 'put', topic);
        yield put(topicsActions.requestList());
        const currentTopic: {} = yield select(topicsActions.currentTopic);
        yield put(topicsActions.topic({ ...currentTopic, ...topic }));
    } catch (e) {
        console.log(e);
        yield put(applicationActions.error(e.message));
        yield put(topicsActions.error(e.message));
    }
    yield afterwards();
}
function* removeProcess({ payload }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/topic/' + payload, 'delete');
        yield put(topicsActions.requestList());
    } catch (e) {
        yield put(applicationActions.error(e.message));
        yield put(topicsActions.error(e.message));
    }
    yield afterwards();
}

export function* topics(): IterableIterator<ForkEffect> {
    yield takeEvery(topicsActions.requestList, requestListProcess);
    yield takeEvery(topicsActions.request, requestProcess);
    yield takeEvery(topicsActions.create, createProcess);
    yield takeEvery(topicsActions.update, updateProcess);
    yield takeEvery(topicsActions.remove, removeProcess);
}