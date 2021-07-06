import { call, ForkEffect, put, select, takeEvery, take } from '@redux-saga/core/effects';

import * as lessonCommentsActions from '../ducks/lessonComments';
import * as lessonsActions from '../ducks/lessons';
import * as applicationActions from '../ducks/application';
import * as filesActions from '../ducks/files';
import { apiRequest } from './index';
import { getApiErrorMessage } from '../functions';
import { Lesson } from '../dataTypes/lesson';
import { LessonComment } from '../dataTypes/lessonComment';
import { getLastUploadedFile } from '../ducks/files';

function* requestListProcess({ payload: { lessonId, userId } }): IterableIterator<any> {
    try {
        const list = yield call(apiRequest, `/api/lesson/${lessonId}/${userId}/comment`)
        yield put(lessonCommentsActions.comments(list));
    } catch (e) {
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
}

function* addProcess({ payload: { lessonId, userId, text, files } }): IterableIterator<any> {
    try {
        const commentFiles = [];
        for (const file of (files || [])) {
            yield put(filesActions.upload(file));
            yield take(filesActions.success);
            const uploadedFileId =  yield select(getLastUploadedFile);
            commentFiles.push({ fileId: uploadedFileId });
            yield put(filesActions.lastUploadedFile(null));
        }

        const newComment: LessonComment = yield call(
            apiRequest,
            `/api/lesson/${lessonId}/${userId}/comment`,
            'post',
            { text, files: commentFiles }
        );
        const currentLesson: Lesson = yield select(lessonsActions.currentLesson);
        if (!currentLesson || currentLesson.id !== lessonId) {
            return;
        }
        const currentCommentsList: LessonComment[] = yield select(lessonCommentsActions.currentList);
        if (currentCommentsList.find(c => c.id === newComment.id)) {
            return;
        }
        yield put(lessonCommentsActions.comments([...currentCommentsList, newComment]));
    } catch (e) {
        yield put(applicationActions.error(getApiErrorMessage(e)));
        yield put(lessonCommentsActions.error(getApiErrorMessage(e)));
    }
}

export function* lessonComments(): IterableIterator<ForkEffect> {
    yield takeEvery(lessonCommentsActions.requestList, requestListProcess);
    yield takeEvery(lessonCommentsActions.add, addProcess);
}