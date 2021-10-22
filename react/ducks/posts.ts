import { handleActions, createAction } from 'redux-actions';
import { characterEntitiesHtml4 } from 'character-entities-html4';
import nu = characterEntitiesHtml4.nu;

const REQUEST_LIST = 'posts/REQUEST_LIST';
const LIST = 'posts/LIST';
const CREATE = 'posts/CREATE';
const UPDATE = 'posts/UPDATE';
const DELETE = 'posts/DELETE';
const CREATED = 'posts/CREATED';
const UPDATED = 'posts/UPDATED';
const DELETED = 'posts/DELETED';
const ERROR = 'posts/ERROR';

export const initialState = {
    list: [],
    error: null,
    loading: false,
    creating: false,
    updating: null,
    deleting: null
};

export default handleActions({
    [REQUEST_LIST]: state => ({ ...state, loading: true }),
    [LIST]: (state, { payload }) => ({ ...state, loading: false, list: payload }),
    [ERROR]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
    [CREATE]: state => ({ ...state, creating: true }),
    [UPDATE]: (state, { payload }) => ({ ...state, updating: payload.id }),
    [DELETE]: (state, { payload }) => ({ ...state, deleting: payload }),
    [CREATED]: state => ({ ...state, creating: false }),
    [UPDATED]: state => ({ ...state, updating: null }),
    [DELETED]: state => ({ ...state, deleting: null }),
}, initialState);

export const requestList = createAction(REQUEST_LIST, () => ({}));
export const list = createAction(LIST, list => list);
export const error = createAction(ERROR, error => error);
export const create = createAction(CREATE, post => post);
export const update = createAction(UPDATE, (id, post) => ({ id, post }));
export const remove = createAction(DELETE, id => id);
export const created = createAction(CREATED, () => ({}));
export const updated = createAction(UPDATED, () => ({}));
export const removed = createAction(DELETED, () => ({}));