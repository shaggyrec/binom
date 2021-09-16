import { call, ForkEffect, put, takeEvery } from '@redux-saga/core/effects';
import * as usersRatingActions from '../ducks/usersRating';
import * as applicationActions from '../ducks/application';
import { apiRequest } from './index';
import { getApiErrorMessage } from '../functions';


function* requestProcess(): IterableIterator<any> {
    const now = (new Date());
    const year = now.getMonth() > 6 ? now.getFullYear() : now.getFullYear() - 1
    try {
        const r = yield call(apiRequest, `/api/rating/${year}`);
        yield put(usersRatingActions.set(r || []));
    } catch (e) {
        yield put(usersRatingActions.set([]));
        yield put(applicationActions.error(getApiErrorMessage(e)));
    }
}

export function* usersRating(): IterableIterator<ForkEffect> {
    yield takeEvery(usersRatingActions.request, requestProcess);
}