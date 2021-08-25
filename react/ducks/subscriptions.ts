import { handleActions, createAction } from 'redux-actions';

const REQUEST_LIST = 'subscriptions/REQUEST_LIST';
const LIST = 'subscriptions/LIST';
const CREATE = 'subscriptions/CREATE';
const UPDATE = 'subscriptions/UPDATE';
const DELETE = 'subscriptions/DELETE';
const SUCCESS = 'subscriptions/DELETE';
const ERROR = 'subscriptions/ERROR';

export const initialState = {
    list: [],
    loading: false,
    error: null
};

export default handleActions({
    [REQUEST_LIST]: state => ({ ...state, loading: true }),
    [LIST]: (state, { payload }) => ({ ...state, loading: false, list: payload }),
    [CREATE]: (state) => ({ ...state, loading: true }),
    [UPDATE]: (state) => ({ ...state, loading: true }),
    [DELETE]: (state) => ({ ...state, loading: true }),
    [SUCCESS]: (state) => ({ ...state, loading: false }),
    [ERROR]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
}, initialState);

export const requestList = createAction(REQUEST_LIST, () => ({}));
export const setList = createAction(LIST, list => list);
export const create = createAction(CREATE, s => s);
export const update = createAction(UPDATE, (id, subscription) => ({ id, subscription }));
export const remove = createAction(DELETE, id => id);
export const success = createAction(SUCCESS, () => ({}));
export const error = createAction(ERROR, e => e);

