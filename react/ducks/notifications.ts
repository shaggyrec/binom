import { handleActions, createAction } from 'redux-actions';

const REQUEST_LIST = 'notifications/REQUEST_LIST';
const LIST = 'notifications/LIST';
const ERROR = 'notifications/ERROR';
const SET_VIEWED = 'notifications/SET_VIEWED';


export const initialState = {
    list: [],
    error: null,
    loading: false,
}

export default handleActions({
    [REQUEST_LIST]: state => ({ ...state, loading: true }),
    [LIST]: (state, { payload }) => ({ ...state, loading: false, list: payload }),
    [ERROR]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
}, initialState);

export const requestList = createAction(REQUEST_LIST, (limit = 50, offset = 0) => ({ limit, offset }));
export const list = createAction(LIST, list => list);
export const error = createAction(ERROR, error => error);
export const setViewed = createAction(SET_VIEWED, id => id);

export const currentList = state => state.notifications.list;