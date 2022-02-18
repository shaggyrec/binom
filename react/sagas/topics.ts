import { ForkEffect, takeEvery, call, put, select } from '@redux-saga/core/effects';

import * as topicsActions from '../ducks/topics';
import * as applicationActions from '../ducks/application';
import { apiRequest } from './index';
import { push } from 'connected-react-router';
import { Topic } from '../dataTypes/topic';
import { getApiErrorMessage } from '../functions';

function* afterwards() {
    yield put(topicsActions.requestList());
    yield put(topicsActions.error(null));
}

function* requestListProcess(): IterableIterator<any> {
    try {
        // TODO Separate for different courses and for admin editing
        const course: { topics: any[] } = yield call(apiRequest, '/api/courses/' + process.env.DEFAULT_COURSE_ID)
        // const topics = yield call(apiRequest,'/api/topic/list?withLessons=true');
        yield put(topicsActions.topics(course.topics));
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

function* createProcess({ payload: { name, alias, course } }): IterableIterator<any> {
    try {
        const topic: Topic = yield call(apiRequest, '/api/topic', 'post', { name, alias, courseId: course });
        yield put(topicsActions.topic(topic));
        yield put(push('/topic/' + topic.alias));
    } catch (e) {
        yield put(applicationActions.error(getApiErrorMessage(e)));
        yield put(topicsActions.error(getApiErrorMessage(e)));
    }
    yield afterwards();
}

function* updateProcess({ payload: { id, topic } }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/topic/' + id, 'put', topic);
        const currentTopic: any = yield select(topicsActions.currentTopic);
        yield put(topicsActions.topic({ ...currentTopic, ...topic }));
    } catch (e) {
        console.log(e);
        yield put(applicationActions.error(getApiErrorMessage(e)));
        yield put(topicsActions.error(getApiErrorMessage(e)));
    }
    yield afterwards();
}
function* removeProcess({ payload }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/topic/' + payload, 'delete');
        yield put(topicsActions.requestList());
        yield put(topicsActions.topic(null));
        yield put(push('/app'));
    } catch (e) {
        yield put(applicationActions.error(getApiErrorMessage(e)));
        yield put(topicsActions.error(getApiErrorMessage(e)));
    }
    yield afterwards();
}

function* moveAtPositionProcess({ payload }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/topic/' + payload.id + '/at/' + payload.pos, 'patch');
        yield put(topicsActions.success());
    } catch (e) {
        yield put(applicationActions.error(getApiErrorMessage(e)));
        yield put(topicsActions.error(getApiErrorMessage(e)));
    }
    yield afterwards();
}

export function* topics(): IterableIterator<ForkEffect> {
    yield takeEvery(topicsActions.requestList, requestListProcess);
    yield takeEvery(topicsActions.request, requestProcess);
    yield takeEvery(topicsActions.create, createProcess);
    yield takeEvery(topicsActions.update, updateProcess);
    yield takeEvery(topicsActions.remove, removeProcess);
    yield takeEvery(topicsActions.moveAtPosition, moveAtPositionProcess);
}