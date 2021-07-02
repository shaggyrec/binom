import { call, ForkEffect, put, takeEvery } from '@redux-saga/core/effects';

import * as lessonCommentsActions from '../ducks/lessonComments';
import * as applicationActions from '../ducks/application';
import { apiRequest } from './index';
import { getApiErrorMessage } from '../functions';

function* requestListProcess({ payload: { lessonId, userId } }): IterableIterator<any> {
    try {
        const list = yield call(apiRequest, `/api/lesson/${lessonId}/${userId}/comment`)
        yield put(lessonCommentsActions.comments(list));
    } catch (e) {
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
}

export function* lessonComments(): IterableIterator<ForkEffect> {
    yield takeEvery(lessonCommentsActions.requestList, requestListProcess);
}