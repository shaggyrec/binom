import { call, CallEffect, ForkEffect, put, PutEffect, takeEvery } from '@redux-saga/core/effects';

import * as postCommentsActions from '../ducks/postComments';
import { apiRequest } from './index';
import * as applicationActions from '../ducks/application';
import { getApiErrorMessage } from '../functions';

function* requestListProcess({ payload }): IterableIterator<CallEffect|PutEffect> {
    try {
        const comments = yield call(apiRequest, `/api/posts/${payload}/comments`);
        yield put(postCommentsActions.list(comments));
    } catch (e) {
        yield put(postCommentsActions.error(getApiErrorMessage(e)));
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
}

function* createProcess({ payload }): IterableIterator<any> {
    try {
        yield call(apiRequest, `/api/posts/${payload.postId}/comments`, 'POST', { text: payload.text });
    } catch (e) {
        yield put(postCommentsActions.error(getApiErrorMessage(e)));
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
    yield put(postCommentsActions.created());
}

function* updateProcess({ payload: { id, comment } }): IterableIterator<CallEffect|PutEffect> {
    try {
        yield call(apiRequest, `/api/comments/${id}`, 'PUT', comment);
    } catch (e) {
        yield put(postCommentsActions.error(getApiErrorMessage(e)));
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
    yield put(postCommentsActions.updated());
}

function* removeProcess({ payload }): IterableIterator<CallEffect|PutEffect> {
    try {
        yield call(apiRequest, `/api/comments/${payload}`, 'DELETE');
    } catch (e) {
        yield put(postCommentsActions.error(getApiErrorMessage(e)));
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
    yield put(postCommentsActions.removed());
}

export function* postComments(): IterableIterator<ForkEffect> {
    yield takeEvery(postCommentsActions.requestList, requestListProcess);
    yield takeEvery(postCommentsActions.create, createProcess);
    yield takeEvery(postCommentsActions.update, updateProcess);
    yield takeEvery(postCommentsActions.remove, removeProcess);
}
