import { handleActions, createAction } from 'redux-actions';

const REQUEST_ME = 'users/REQUEST_ME';
const ME = 'users/ME';
const REQUEST = 'users/REQUEST';
const CURRENT_USER = 'users/CURRENT_USER';
const UPDATE = 'users/UPDATE';
const ERROR = 'users/ERROR';
const ERROR_CODE = 'users/ERROR_CODE';
const SUCCESS = 'users/SUCCESS';

export const initialState = {
    me: null,
    current: null,
    error: null,
    errorCode: null,
    loading: false,
};

export default handleActions({
    [REQUEST_ME]: state => ({ ...state, loading: true }),
    [REQUEST]: state => ({ ...state, loading: true }),
    [ME]: (state, { payload }) => ({ ...state, loading: false, me: payload }),
    [CURRENT_USER]: (state, { payload }) => ({ ...state, loading: false, current: payload }),
    [ERROR]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
    [ERROR_CODE]: (state, { payload }) => ({ ...state, loading: false, errorCode: payload }),
    [UPDATE]: state => ({ ...state, loading: true }),
    [SUCCESS]: state => ({ ...state, loading: false }),
}, initialState);

export const requestMe = createAction(REQUEST_ME, () => {});
export const setMe = createAction(ME, user => user);
export const error = createAction(ERROR, err => err);
export const success = createAction(SUCCESS, () => {});
export const update = createAction(UPDATE, (id, data) => ({ id, data }));
export const errorCode = createAction(ERROR_CODE, code => code);
export const requestUser = createAction(REQUEST, username => username);
export const setCurrentUser = createAction(CURRENT_USER, user => user);

export const getMe = state => state.users.me;