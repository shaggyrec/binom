import { handleActions, createAction } from 'redux-actions';

const REQUEST_LIST = 'notifications/REQUEST_LIST';
const LIST = 'notifications/LIST';
const ADD_TO_LIST = 'notifications/ADD_TO_LIST';
const ERROR = 'notifications/ERROR';
const SET_VIEWED = 'notifications/SET_VIEWED';
const SET_NO_MORE = 'notifications/SET_NO_MORE';


export const initialState = {
    list: [],
    error: null,
    loading: false,
    noMore: false,
}

export default handleActions({
    [REQUEST_LIST]: state => ({ ...state, loading: true }),
    [LIST]: (state, { payload }) => ({ ...state, loading: false, list:payload }),
    [ADD_TO_LIST]: (state, { payload }) => ({ ...state, loading: false, list: [...state.list, ...payload] }),
    [ERROR]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
    [SET_NO_MORE]: state => ({ ...state, loading: false, noMore: true })
}, initialState);

export const requestList = createAction(REQUEST_LIST, (limit = 50, offset = 0) => ({ limit, offset }));
export const list = createAction(LIST, list => list);
export const addToList = createAction(ADD_TO_LIST, list => list);
export const error = createAction(ERROR, error => error);
export const setViewed = createAction(SET_VIEWED, id => id);
export const setNoMore = createAction(SET_NO_MORE, () => {});

export const currentList = state => state.notifications.list;