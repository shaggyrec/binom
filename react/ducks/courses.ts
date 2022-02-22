import { handleActions, createAction } from 'redux-actions';

const REQUEST_COURSE = 'courses/REQUEST_COURSE';
const REQUEST = 'courses/REQUEST';
const COURSE = 'courses/COURSE';
const COURSES = 'courses/COURSES';
const ERROR = 'courses/ERROR';

export const initialState = {
    current: null,
    list: [],
    error: null,
    loading: false,
};

export default handleActions({
    [REQUEST_COURSE]: state => ({ ...state, loading: true }),
    [REQUEST]: state => ({ ...state, loading: true }),
    [COURSE]: (state, { payload }) => ({ ...state, loading: false, current: payload }),
    [COURSES]: (state, { payload }) => ({ ...state, loading: false, list: payload }),
    [ERROR]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
}, initialState);

export const requestCourse = createAction(REQUEST_COURSE, id => id);
export const course = createAction(COURSE, c => c);
export const request = createAction(REQUEST, () => ({}));
export const list = createAction(COURSES, list => list);
export const error = createAction(ERROR, e => e);