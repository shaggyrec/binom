import { handleActions, createAction } from 'redux-actions';

const REQUEST_LIST = 'postComments/REQUEST_LIST';
const LIST = 'postComments/LIST';
const CREATE = 'postComments/CREATE';
const UPDATE = 'postComments/UPDATE';
const DELETE = 'postComments/DELETE';
const CREATED = 'postComments/CREATED';
const UPDATED = 'postComments/UPDATED';
const DELETED = 'postComments/DELETED';
const ERROR = 'postComments/ERROR';

export const initialState = {
    list: {},
    error: null,
    loading: false,
    creating: false,
    updating: null,
    deleting: null
};

export default handleActions({
    [REQUEST_LIST]: state => ({ ...state, loading: true }),
    [LIST]: (state, { payload: { id, list } }) => ({ ...state, loading: false, list: { ...state.list, [id]: list } }),
    [ERROR]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
    [CREATE]: state => ({ ...state, creating: true }),
    [UPDATE]: (state, { payload }) => ({ ...state, updating: payload.id }),
    [DELETE]: (state, { payload }) => ({ ...state, deleting: payload }),
    [CREATED]: state => ({ ...state, creating: false }),
    [UPDATED]: state => ({ ...state, updating: null }),
    [DELETED]: state => ({ ...state, deleting: null }),
}, initialState);

export const requestList = createAction(REQUEST_LIST, id => id);
export const list = createAction(LIST, (id, list) => ({ id, list }));
export const error = createAction(ERROR, error => error);
export const create = createAction(CREATE, post => post);
export const update = createAction(UPDATE, (id, post) => ({ id, post }));
export const remove = createAction(DELETE, id => id);
export const created = createAction(CREATED, () => ({}));
export const updated = createAction(UPDATED, () => ({}));
export const removed = createAction(DELETED, () => ({}));