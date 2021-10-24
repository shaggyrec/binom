import { call, ForkEffect, put, takeEvery } from '@redux-saga/core/effects';

import * as filesActions from '../ducks/files';
import * as applicationActions from '../ducks/application';
import { apiRequest } from './index';
import { getApiErrorMessage } from '../functions';

export function* uploadProcess({ payload }): IterableIterator<any> {
    const formData = new FormData();
    formData.append('file', payload);
    formData.append('isPublic', payload.isPublic ? 'true' : 'false')
    try {
        const uploadedFile: { id: string } = yield call(
            apiRequest,
            '/api/file',
            'post',
            formData,
            { 'Content-Type': 'multipart/form-data' }
        )
        yield put(filesActions.success(uploadedFile.id));
        yield put(filesActions.file(uploadedFile));
        return uploadedFile.id;
    } catch (e) {
        yield put(filesActions.error(getApiErrorMessage(e)));
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }

}

function* requestProcess({ payload }): IterableIterator<any> {
    try {
        const file = yield call(apiRequest, '/api/file/' + payload);
        yield put(filesActions.file(file));
    } catch (e) {
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
}

function* removeProcess({ payload }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/file/' + payload, 'DELETE');
        yield put(filesActions.success());
        yield put(filesActions.lastRemovedFile(payload));
    } catch (e) {
        yield put(filesActions.error(getApiErrorMessage(e)));
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
}

export function* files(): IterableIterator<ForkEffect> {
    yield takeEvery(filesActions.upload, uploadProcess);
    yield takeEvery(filesActions.request, requestProcess);
    yield takeEvery(filesActions.remove, removeProcess);
}