import { all } from '@redux-saga/core/effects';
import { topics } from './topics';
import { users } from './users';
import { auth } from './auth';

export default function* rootSaga(): any {
    yield all([topics(), users(), auth()]);
}