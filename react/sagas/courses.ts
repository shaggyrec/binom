import { call, ForkEffect, put, takeEvery } from '@redux-saga/core/effects';

import * as coursesActions from '../ducks/courses';
import * as applicationActions from '../ducks/application';
import { getApiErrorMessage } from '../functions';
import { apiRequest } from './index';

function* requestCourseProcess({ payload }): IterableIterator<any> {
    try {
        yield put(
            coursesActions.course(
                yield call(apiRequest, '/api/courses/' + payload)
            )
        );
    } catch (e) {
        const m = getApiErrorMessage(e)
        yield put(applicationActions.error(m));
        yield put(coursesActions.error(m));
    }
}

function* requestProcess(): IterableIterator<any> {
    try {
        yield put(coursesActions.list(yield call(apiRequest, '/api/courses')));
    } catch (e) {
        const m = getApiErrorMessage(e)
        yield put(applicationActions.error(m));
        yield put(coursesActions.error(m));
    }
}

export function* courses(): IterableIterator<ForkEffect> {
    yield takeEvery(coursesActions.requestCourse, requestCourseProcess);
    yield takeEvery(coursesActions.request, requestProcess);
}