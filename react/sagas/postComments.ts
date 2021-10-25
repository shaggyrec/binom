import { call, CallEffect, ForkEffect, put, PutEffect, select, takeEvery } from '@redux-saga/core/effects';

import * as postCommentsActions from '../ducks/postComments';
import { apiRequest } from './index';
import * as applicationActions from '../ducks/application';
import { getApiErrorMessage } from '../functions';
import { Post } from '../dataTypes/post';
import * as postsActions from '../ducks/posts';

function* requestListProcess({ payload }): IterableIterator<CallEffect|PutEffect> {
    try {
        const comments = yield call(apiRequest, `/api/posts/${payload}/comments`);
        yield put(postCommentsActions.list(payload, comments));
    } catch (e) {
        yield put(postCommentsActions.error(getApiErrorMessage(e)));
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
}

function* createProcess({ payload }): IterableIterator<any> {
    try {
        const comment: Post = yield call(apiRequest, `/api/posts/${payload.postId}/comments`, 'POST', { text: payload.text });
        yield put(postCommentsActions.newComment(comment));
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

function* newCommentProcess({ payload }): IterableIterator<any> {
    const comments: Post[] = yield select(postCommentsActions.commentsByPostId, payload.postId);
    if (comments?.find(c => payload.id === c.id)) {
        return
    }
    yield put(postCommentsActions.list(payload.postId, [...(comments || []), payload]));
}

export function* postComments(): IterableIterator<ForkEffect> {
    yield takeEvery(postCommentsActions.requestList, requestListProcess);
    yield takeEvery(postCommentsActions.create, createProcess);
    yield takeEvery(postCommentsActions.update, updateProcess);
    yield takeEvery(postCommentsActions.remove, removeProcess);
    yield takeEvery(postCommentsActions.newComment, newCommentProcess)
}
