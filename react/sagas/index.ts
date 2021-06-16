import { all } from '@redux-saga/core/effects';
import { topics } from './topics';

export default function* rootSaga(): any {
    yield all([topics()]);
}