import { handleActions, createAction } from 'redux-actions';

const REQUEST_LIST = 'subscriptions/REQUEST_LIST';
const LIST = 'subscriptions/LIST';
const SUCCESS = 'subscriptions/SUCCESS';
const ERROR = 'subscriptions/ERROR';
const BUY = 'subscriptions/BUY';

export const initialState = {
    list: [],
    special: null,
    loading: false,
    error: null
};

export default handleActions({
    [REQUEST_LIST]: state => ({ ...state, loading: true }),
    [LIST]: (state, { payload }) => ({ ...state, loading: false, list: payload }),
    [SUCCESS]: (state) => ({ ...state, loading: false }),
    [BUY]: (state) => ({ ...state, loading: true }),
    [ERROR]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
}, initialState);

export const requestList = createAction(REQUEST_LIST, () => ({}));
export const setList = createAction(LIST, list => list);
export const error = createAction(ERROR, e => e);
export const buy = createAction(BUY, (topics) => (topics));
export const success = createAction(SUCCESS, () => ({}));
