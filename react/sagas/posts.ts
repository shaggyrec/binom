import { call, CallEffect, ForkEffect, put, PutEffect, takeEvery } from '@redux-saga/core/effects';

import * as postsActions from '../ducks/posts';
import * as postCommentsActions from '../ducks/postComments';
import { apiRequest } from './index';
import * as applicationActions from '../ducks/application';
import { uploadProcess } from '../sagas/files';
import { getApiErrorMessage } from '../functions';
import { Post } from '../dataTypes/post';

function* requestListProcess(): IterableIterator<CallEffect|PutEffect> {
    try {
        const posts: Post[] = yield call(apiRequest, '/api/posts');
        yield put(postsActions.list(posts));
        for (const post of posts) {
            yield put(postCommentsActions.list(post.id, post.comments))
        }
    } catch (e) {
        yield put(postsActions.error(getApiErrorMessage(e)));
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
}

function* createProcess({ payload }): IterableIterator<any> {
    try {
        const images = [];
        if (payload.images) {
            for (const file of payload.images) {
                file.isPublic = true;
                const id = yield uploadProcess({ payload: file });
                images.push(id);
            }
            payload.images = images;
        }
        yield call(apiRequest, '/api/posts', 'POST', payload);
    } catch (e) {
        yield put(postsActions.error(getApiErrorMessage(e)));
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
    yield put(postsActions.created());
}

function* updateProcess({ payload: { id, post } }): IterableIterator<CallEffect|PutEffect> {
    try {
        yield call(apiRequest, `/api/posts/${id}`, 'PUT', post);
    } catch (e) {
        yield put(postsActions.error(getApiErrorMessage(e)));
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
    yield put(postsActions.updated());
}

function* removeProcess({ payload }): IterableIterator<CallEffect|PutEffect> {
    try {
        yield call(apiRequest, `/api/posts/${payload}`, 'DELETE');
    } catch (e) {
        yield put(postsActions.error(getApiErrorMessage(e)));
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
    yield put(postsActions.removed());
}

export function* posts(): IterableIterator<ForkEffect> {
    yield takeEvery(postsActions.requestList, requestListProcess);
    yield takeEvery(postsActions.create, createProcess);
    yield takeEvery(postsActions.update, updateProcess);
    yield takeEvery(postsActions.remove, removeProcess);
}
