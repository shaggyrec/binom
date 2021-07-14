import { handleActions, createAction } from 'redux-actions';

const REQUEST_LIST = 'notifications/REQUEST_LIST';
const LIST = 'notifications/LIST';
const ERROR = 'notifications/ERROR';


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

export const requestList = createAction(REQUEST_LIST, () => {});
export const list = createAction(LIST, list => list);
export const error = createAction(ERROR, error => error);