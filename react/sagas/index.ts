import { all, call } from '@redux-saga/core/effects';
import { AxiosResponse, Method } from 'axios';

import { topics } from './topics';
import { users } from './users';
import { auth } from './auth';
import { serverRequest } from '../functions';
import { ApiErrors } from '../ApiErrors';
import { refreshTokenProcess } from '../sagas/auth';

export function* apiRequest(url: string, method: Method  = 'GET', body: any = {}, options: any = {}): IterableIterator<any> {
    try {
        const { data }: AxiosResponse = yield call(serverRequest, url, method, body, options);
        return data;
    } catch (e) {
        const { status, data } = e.response;
        if (status === 401 && data.code === ApiErrors.ErrorBadToken) {
            try {
                yield refreshTokenProcess()
                return yield apiRequest(url, method, body, options);
            } catch (e) {
                console.log('apiRequest Error ' + e.message);
            }
        }
    }
}

export default function* rootSaga(): any {
    yield all([topics(), users(), auth()]);
}