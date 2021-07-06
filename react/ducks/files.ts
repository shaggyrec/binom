import { handleActions, createAction } from 'redux-actions';

const UPLOAD = 'files/UPLOAD';
const SUCCESS = 'files/SUCCESS';
const ERROR = 'files/ERROR';
const REQUEST = 'files/REQUEST';
const FILE = 'files/FILE';
const LAST_UPLOADED_FILE = 'files/LAST_UPLOADED_FILE';
const LAST_REMOVED_FILE = 'files/LAST_REMOVED_FILE';
const REMOVE = 'files/REMOVE';
const REMOVE_FILE = 'files/REMOVE_FILE';

export const initialState = {
    files: {},
    lastUploadedFile: null,
    loading: false,
    error: null,
};

export default handleActions({
    [UPLOAD]: state => ({ ...state, loading: true }),
    [REQUEST]: state => ({ ...state, loading: true }),
    [REMOVE]: state => ({ ...state, loading: true }),
    [SUCCESS]: (state, { payload }) => ({ ...state, loading: false, lastUploadedFile: payload }),
    [ERROR]: (state, { payload }) => ({ ...state, loading: false, error: payload, lastUploadedFile: null, }),
    [LAST_UPLOADED_FILE]: (state, { payload }) => ({ ...state, lastUploadedFile: payload }),
    [LAST_REMOVED_FILE]: (state, { payload }) => ({ ...state, lastRemovedFile: payload }),
    [FILE]: (state, { payload }) => ({ ...state, loading: false, error: null, files: { ...state.files, [payload.id]: payload } }),
    [REMOVE_FILE]: (state, { payload }) => {
        const { [payload.id]: r, ...files } = state.files;
        return ({  ...state, loading: false, error: null, files, lastRemovedFile: payload.id })
    }
}, initialState);

export const upload = createAction(UPLOAD, file => file);
export const request = createAction(REQUEST, id => id);
export const file = createAction(FILE, file => file);
export const removeFile = createAction(REMOVE_FILE, file => file);
export const error = createAction(ERROR, e => e);
export const success = createAction(SUCCESS, any => any);
export const lastUploadedFile = createAction(LAST_UPLOADED_FILE, payload => payload);
export const lastRemovedFile = createAction(LAST_REMOVED_FILE, file => file);
export const remove = createAction(REMOVE, id => id);



export const fileById = (state, id) => state.files.files[id];
export const getLastUploadedFile = state => state.files.lastUploadedFile;