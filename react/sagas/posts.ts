import {
    call,
    CallEffect,
    ForkEffect,
    put,
    PutEffect,
    select,
    SelectEffect,
    takeEvery
} from '@redux-saga/core/effects';

import * as postsActions from '../ducks/posts';
import * as postCommentsActions from '../ducks/postComments';
import { apiRequest } from './index';
import * as applicationActions from '../ducks/application';
import { uploadProcess } from '../sagas/files';
import { getApiErrorMessage } from '../functions';
import { Post } from '../dataTypes/post';

const POSTS_PER_QUERY = 20;

function* requestListProcess(): IterableIterator<CallEffect|PutEffect|SelectEffect> {
    try {
        const currentPostsList: any[] = yield select(postsActions.currentPostsList);
        const posts: Post[] = yield call(apiRequest, '/api/posts?limit=' + POSTS_PER_QUERY + '&offset=' + currentPostsList.length);
        posts.filter(p => !currentPostsList.find(post => post.id === p.id));
        yield put(postsActions.list([...currentPostsList, ...posts]));
        for (const post of posts) {
            yield put(postCommentsActions.list(post.id, post.comments))
        }
        if (posts.length === 0) {
            yield put(postsActions.noMore());
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
        const newPost = yield call(apiRequest, '/api/posts', 'POST', payload);
        yield put(postsActions.newPost(newPost));
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

function* newPostProcess({ payload }): IterableIterator<any> {
    const posts: Post[] = yield select(postsActions.currentPostsList);
    if (posts.find(p => payload.id === p.id)) {
        return
    }
    yield put(postsActions.list([payload, ...posts]));
}

export function* posts(): IterableIterator<ForkEffect> {
    yield takeEvery(postsActions.requestList, requestListProcess);
    yield takeEvery(postsActions.create, createProcess);
    yield takeEvery(postsActions.update, updateProcess);
    yield takeEvery(postsActions.remove, removeProcess);
    yield takeEvery(postsActions.newPost, newPostProcess)
}
