import {combineReducers, Reducer} from 'redux';
import topics, { initialState as topicsState } from './topics';

export const initialState = {
    topics: topicsState
};

export default (router: any = null): Reducer => combineReducers({
    router,
    topics
});