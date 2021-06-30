import { handleActions, createAction } from 'redux-actions';

const REQUEST_LIST = 'topics/REQUEST_LIST';
const TOPICS = 'topics/TOPICS';
const TOPIC = 'topics/TOPIC';
const CREATE = 'topics/CREATE';
const REQUEST = 'topics/REQUEST';
const UPDATE = 'topics/UPDATE';
const DELETE = 'topics/DELETE';
const SUCCESS = 'topics/SUCCESS';
const ERROR = 'topics/ERROR';
const MOVE_AT_POSITION = 'topics/MOVE_AT_POSITION';

export const initialState = {
    list: [],
    current: null,
    error: null,
    loading: false
};

export default handleActions({
    [REQUEST_LIST]: state => ({ ...state, loading: true }),
    [REQUEST]: state => ({ ...state, loading: true }),
    [CREATE]: state => ({ ...state, loading: true }),
    [UPDATE]: state => ({ ...state, loading: true }),
    [DELETE]: state => ({ ...state, loading: true }),
    [TOPICS]: (state, { payload }) => ({ ...state, list: payload, loading: false }),
    [TOPIC]: (state, { payload }) => ({ ...state, current: payload, loading: false }),
    [ERROR]: (state, { payload }) => ({ ...state, error: payload , loading: false }),
    [SUCCESS]: state => ({ ...state, loading: false }),
    [MOVE_AT_POSITION]: state => ({ ...state, loading: true }),
}, initialState);

export const requestList = createAction(REQUEST_LIST, () => {});
export const topics = createAction(TOPICS, topics => topics);
export const topic = createAction(TOPIC, topic => topic);
export const error = createAction(ERROR, error => error);
export const create = createAction(CREATE, (name: string, alias: string) => ({ name, alias }));
export const request = createAction(REQUEST, alias => alias);
export const update = createAction(UPDATE, (id, topic) => ({ id, topic }));
export const remove = createAction(DELETE, id => id);
export const success = createAction(SUCCESS, () => {});
export const moveAtPosition = createAction(MOVE_AT_POSITION, (id, pos) => ({ id, pos }));

export const currentTopic = state => state.topics.current