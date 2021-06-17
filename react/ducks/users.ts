import { handleActions, createAction } from 'redux-actions';

const REQUEST_ME = 'users/REQUEST_ME';
const ME = 'users/ME';
const ERROR = 'users/ERROR';

export const initialState = {
    me: null,
    error: null,
    loading: false
};

export default handleActions({
    [REQUEST_ME]: state => ({ ...state, loading: true }),
    [ME]: (state, { payload }) => ({ ...state, loading: false, me: payload }),
    [ERROR]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
}, initialState);

export const requestMe = createAction(REQUEST_ME, () => {});
export const setMe = createAction(ME, user => user);
export const error = createAction(ERROR, err => err);