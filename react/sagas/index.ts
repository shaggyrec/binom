import { all, call, put } from '@redux-saga/core/effects';
import { push } from 'connected-react-router';
import { AxiosResponse, Method } from 'axios';

import { topics } from './topics';
import { users } from './users';
import { auth, refreshTokenProcess } from './auth';
import { serverRequest } from '../functions';
import { ApiErrors } from '../ApiErrors';
import { lessons } from './lessons';
import { files } from './files';
import { lessonComments } from './lessonComments';
import { notifications } from './notifications';
import { learningProgress } from './learningProgress';
import { tariffs } from './tariffs';
import * as applicationActions from '../ducks/application';
import { usersRating } from './usersRating';
import { posts } from './posts';
import { postComments } from './postCommnets';

const MAX_REQUEST_TRIES = 10;
let tries = 0;

export function* apiRequest(url: string, method: Method  = 'GET', body: any = {}, options: any = {}): IterableIterator<any> {
    try {
        const { data }: AxiosResponse = yield call(serverRequest, url, method, body, options);
        tries = 0;
        return data;
    } catch (e) {
        if (!e.response) {
            yield put(applicationActions.error(e.message));
            return;
        }
        const { status, data } = e.response;
        if (status === 401 && data.code === ApiErrors.ErrorBadToken) {
            try {
                yield refreshTokenProcess()
                tries++;
                if (tries >= MAX_REQUEST_TRIES) {
                    yield push('/auth');
                    tries = 0;
                    return;
                }
                return yield apiRequest(url, method, body, options);
            } catch (e) {
                console.log('apiRequest Error ' + e.message);
            }
        } else {
            tries = 0;
            throw e;
        }
    }
}

export default function* rootSaga(): any {
    yield all([
        topics(),
        users(),
        auth(),
        lessons(),
        files(),
        lessonComments(),
        notifications(),
        learningProgress(),
        tariffs(),
        usersRating(),
        posts(),
        postComments(),
    ]);
}