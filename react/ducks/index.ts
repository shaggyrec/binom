import {combineReducers, Reducer} from 'redux';
import topics, { initialState as topicsState } from './topics';
import users, { initialState as usersState } from './users';
import auth, { initialState as authState } from './auth';

export const initialState = {
    topics: topicsState,
    users: usersState,
    auth: authState,
};

export default (router: any = null): Reducer => combineReducers({
    router,
    topics,
    users,
    auth,
});