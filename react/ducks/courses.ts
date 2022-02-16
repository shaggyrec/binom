import { handleActions, createAction } from 'redux-actions';

const REQUEST_COURSE = 'courses/REQUEST_COURSE';
const COURSE = 'courses/COURSE';
const ERROR = 'courses/ERROR';

export const initialState = {
    current: null,
    error: null,
    loading: false,
};

export default handleActions({
    [REQUEST_COURSE]: state => ({ ...state, loading: true }),
    [COURSE]: (state, { payload }) => ({ ...state, loading: false, current: payload }),
    [ERROR]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
}, initialState);

export const requestCourse = createAction(REQUEST_COURSE, id => id);
export const course = createAction(COURSE, c => c);
export const error = createAction(ERROR, e => e);