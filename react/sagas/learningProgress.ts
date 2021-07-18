import { call, put, takeEvery } from '@redux-saga/core/effects';

import * as learningProgressActions from '../ducks/learningProgress';
import * as applicationActions from '../ducks/application';
import { getApiErrorMessage } from '../functions';
import { apiRequest } from './index';

function* saveProcess({ payload: { lessonAlias, userId } }): IterableIterator<any> {
    try {
        yield call(apiRequest, `/api/progress/${userId}/${lessonAlias}`, 'PATCH');
    } catch (e) {
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
}

function* requestProgressForLessonProcess({ payload: { lessonAlias, userId } }): IterableIterator<any> {
    try {
        const p: { passed: boolean } = yield call(apiRequest, `/api/progress/${userId}/${lessonAlias}`);
        yield put(learningProgressActions.progressForLesson(userId, lessonAlias, p.passed));
    } catch (e) {
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
}

export function* learningProgress (): IterableIterator<any> {
    yield takeEvery(learningProgressActions.save, saveProcess);
    yield takeEvery(learningProgressActions.requestProgressForLesson, requestProgressForLessonProcess);
}