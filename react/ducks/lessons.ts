import { handleActions, createAction } from 'redux-actions';

const REQUEST_LIST = 'lessons/REQUEST_LIST';
const LESSONS = 'lessons/LESSONS';
const LESSON = 'lessons/LESSON';
const CREATE = 'lessons/CREATE';
const REQUEST = 'lessons/REQUEST';
const UPDATE = 'lessons/UPDATE';
const DELETE = 'lessons/DELETE';
const SUCCESS = 'lessons/SUCCESS';
const ERROR = 'lessons/ERROR';
const MOVE_AT_POSITION = 'lessons/MOVE_AT_POSITION';

export const initialState = {
    list: [],
    current: null,
    error: null,
    loading: false
};

export default handleActions({
    [REQUEST_LIST]: state => ({ ...state, loading: true }),
    [MOVE_AT_POSITION]: state => ({ ...state, loading: true }),
    [REQUEST]: state => ({ ...state, loading: true }),
    [CREATE]: state => ({ ...state, loading: true }),
    [UPDATE]: state => ({ ...state, loading: true }),
    [DELETE]: state => ({ ...state, loading: true }),
    [LESSONS]: (state, { payload }) => ({ ...state, list: payload, loading: false }),
    [LESSON]: (state, { payload }) => ({ ...state, current: payload, loading: false }),
    [ERROR]: (state, { payload }) => ({ ...state, error: payload , loading: false }),
    [SUCCESS]: state => ({ ...state, loading: false }),
}, initialState);

export const requestList = createAction(REQUEST_LIST, () => {});
export const lessons = createAction(LESSONS, lessons => lessons);
export const lesson = createAction(LESSON, lesson => lesson);
export const error = createAction(ERROR, error => error);
export const create = createAction(CREATE, (name: string, alias: string, topic: string) => ({ name, alias, topic }));
export const request = createAction(REQUEST, alias => alias);
export const update = createAction(UPDATE, (id, lesson) => ({ id, lesson }));
export const remove = createAction(DELETE, id => id);
export const success = createAction(SUCCESS, () => {});
export const moveAtPosition = createAction(MOVE_AT_POSITION, (id, pos) => ({ id, pos }));


export const currentLesson = state => state.lessons.current