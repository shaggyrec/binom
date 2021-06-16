import { handleActions, createAction } from 'redux-actions';

const REQUEST_LIST = 'topics/REQUEST_LIST';
const TOPICS = 'topics/TOPICS';
const ERROR = 'topics/ERROR';

export const initialState = {
    list: [],
    current: null,
    error: null,
    loading: false
};

export default handleActions({
    [REQUEST_LIST]: state => ({ ...state, loading: true }),
    [TOPICS]: (state, { payload }) => ({ ...state, list: payload, loading: false }),
    [ERROR]: (state, { payload }) => ({ ...state, error: payload , loading: false }),
}, initialState);

export const requestList = createAction(REQUEST_LIST, () => {});
export const topics = createAction(TOPICS, topics => topics);
export const error = createAction(ERROR, error => error);