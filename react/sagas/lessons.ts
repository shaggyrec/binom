import { ForkEffect, takeEvery, call, put, select } from '@redux-saga/core/effects';

import * as lessonsActions from '../ducks/lessons';
import * as topicsActions from '../ducks/topics';
import * as applicationActions from '../ducks/application';
import { apiRequest } from './index';
import { push } from 'connected-react-router';
import { Lesson } from '../dataTypes/lesson';
import { getApiErrorMessage } from '../functions';

function* afterwards() {
    yield put(topicsActions.requestList());
    yield put(lessonsActions.error(null));
}


function* requestListProcess(): IterableIterator<any> {
    try {
        const lessons = yield call(apiRequest,'/api/lessons/list');
        yield put(lessonsActions.lessons(lessons));
    } catch (e) {
        yield put(lessonsActions.error(e.message))
    }
}

function* requestProcess({ payload: alias }): IterableIterator<any> {
    try {
        yield put(lessonsActions.lesson(yield call(apiRequest, '/api/lesson/' + alias)));
    } catch (e) {
        if (e.response.status === 404) {
            yield put(push('/404'));
        }
        if (e.response.status === 403) {
            yield put(push('/app'));
        }
        yield put(lessonsActions.error(e.message));
    }
}

function* createProcess({ payload: { name, alias, topic } }): IterableIterator<any> {
    try {
        const lesson: Lesson = yield call(apiRequest, '/api/lesson', 'post', { name, alias, topicId: topic });
        yield put(lessonsActions.lesson(lesson));
        yield put(push('/lesson/' + lesson.alias));
        yield afterwards();
    } catch ({ response, message }) {
        const { data } = response;
        yield put(applicationActions.error(data.message || message));
        yield put(lessonsActions.error(data.message || message));
    }
}

function* updateProcess({ payload: { id, lesson } }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/lesson/' + id, 'put', lesson);
        const currentLesson: {} = yield select(lessonsActions.currentLesson);
        yield put(lessonsActions.lesson({ ...currentLesson, ...lesson }));
        yield afterwards();
    } catch (e) {
        console.log(e);
        yield put(applicationActions.error(e.message));
        yield put(lessonsActions.error(e.message));
    }
}
function* removeProcess({ payload }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/lesson/' + payload, 'delete');
        yield put(lessonsActions.success());
        yield afterwards();
    } catch (e) {
        yield put(applicationActions.error(e.message));
        yield put(lessonsActions.error(e.message));
    }
}

function* moveAtPositionProcess({ payload }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/lesson/' + payload.id + '/at/' + payload.pos, 'patch');
        yield put(lessonsActions.success());
    } catch (e) {
        yield put(applicationActions.error(getApiErrorMessage(e)));
        yield put(lessonsActions.error(getApiErrorMessage(e)));
    }
    yield afterwards();
}

export function* lessons(): IterableIterator<ForkEffect> {
    yield takeEvery(lessonsActions.requestList, requestListProcess);
    yield takeEvery(lessonsActions.request, requestProcess);
    yield takeEvery(lessonsActions.create, createProcess);
    yield takeEvery(lessonsActions.update, updateProcess);
    yield takeEvery(lessonsActions.remove, removeProcess);
    yield takeEvery(lessonsActions.moveAtPosition, moveAtPositionProcess);
}