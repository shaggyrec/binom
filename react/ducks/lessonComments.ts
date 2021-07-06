import { handleActions, createAction } from 'redux-actions';

const REQUEST_LIST = 'lessonComments/REQUEST_LIST';
const COMMENTS = 'lessonComments/LESSONS';
const ADD = 'lessonComments/ADD';
const UPDATE = 'lessonComments/UPDATE';
const DELETE = 'lessonComments/DELETE';
const SUCCESS = 'lessonComments/SUCCESS';
const ERROR = 'lessonComments/ERROR';

export const initialState = {
    list: [],
    error: null,
    loading: false
};

export default handleActions({
    [REQUEST_LIST]: state => ({ ...state, loading: true }),
    [ADD]: state => ({ ...state, loading: true }),
    [UPDATE]: state => ({ ...state, loading: true }),
    [DELETE]: state => ({ ...state, loading: true }),
    [COMMENTS]: (state, { payload }) => ({ ...state, list: payload, loading: false }),
    [ERROR]: (state, { payload }) => ({ ...state, error: payload , loading: false }),
    [SUCCESS]: state => ({ ...state, loading: false }),
}, initialState);

export const requestList = createAction(REQUEST_LIST, (lessonId, userId) => ({ lessonId, userId }));
export const comments = createAction(COMMENTS, c => c);
export const error = createAction(ERROR, error => error);
export const add = createAction(ADD, (lessonId, userId, text, files) => ({ lessonId, userId, text, files }));
export const update = createAction(UPDATE, (id, comment) => ({ id, comment }));
export const remove = createAction(DELETE, id => id);
export const success = createAction(SUCCESS, () => {});


export const currentList = state => state.lessonComments.list;