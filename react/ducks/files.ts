import { handleActions, createAction } from 'redux-actions';

const UPLOAD = 'files/UPLOAD';
const SUCCESS = 'files/SUCCESS';
const ERROR = 'files/ERROR';
const REQUEST = 'files/REQUEST';
const FILE = 'files/FILE';
const LAST_UPLOADED_FILE = 'files/LAST_UPLOADED_FILE';

export const initialState = {
    files: {},
    lastUploadedFile: null,
    loading: false,
    error: null,
};

export default handleActions({
    [UPLOAD]: state => ({ ...state, loading: true }),
    [REQUEST]: state => ({ ...state, loading: true }),
    [SUCCESS]: (state, { payload }) => ({ ...state, loading: false, lastUploadedFile: payload }),
    [ERROR]: (state, { payload }) => ({ ...state, loading: false, error: payload, lastUploadedFile: null, }),
    [LAST_UPLOADED_FILE]: (state, { payload }) => ({ ...state, lastUploadedFile: payload }),
    [FILE]: (state, { payload }) => ({ ...state, loading: false, error: null, files: { ...state.files, [payload.id]: payload } })
}, initialState);

export const upload = createAction(UPLOAD, file => file);
export const request = createAction(REQUEST, id => id);
export const file = createAction(FILE, file => file);
export const error = createAction(ERROR, e => e);
export const success = createAction(SUCCESS, any => any);
export const lastUploadedFile = createAction(LAST_UPLOADED_FILE, payload => payload);


export const fileById = (state, id) => state.files.files[id];