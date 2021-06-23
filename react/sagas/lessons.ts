import { ForkEffect, takeEvery, call, put, select } from '@redux-saga/core/effects';

import * as lessonsActions from '../ducks/lessons';
import * as applicationActions from '../ducks/application';
import { apiRequest } from './index';
import { push } from 'connected-react-router';
import { Lesson } from '../dataTypes/Lesson';
import { lesson } from '../ducks/lessons';


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
        yield put(lessonsActions.error(e.message));
    }
}

function* createProcess({ payload: { name, alias, topic } }): IterableIterator<any> {
    try {
        const lesson: Lesson = yield call(apiRequest, '/api/lesson', 'post', { name, alias, topicId: topic });
        yield put(lessonsActions.lesson(lesson));
        yield put(push('/lesson/' + lesson.alias));
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
    } catch (e) {
        yield put(applicationActions.error(e.message));
        yield put(lessonsActions.error(e.message));
    }
}

export function* lessons(): IterableIterator<ForkEffect> {
    yield takeEvery(lessonsActions.requestList, requestListProcess);
    yield takeEvery(lessonsActions.request, requestProcess);
    yield takeEvery(lessonsActions.create, createProcess);
    yield takeEvery(lessonsActions.update, updateProcess);
    yield takeEvery(lessonsActions.remove, removeProcess);
}