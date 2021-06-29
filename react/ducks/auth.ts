import { handleActions, createAction } from 'redux-actions';

const SET_EMAIL = 'auth/SET_EMAIL';
const SET_CODE = 'auth/SET_CODE';
const SET_FROM = 'auth/SET_FROM';
const SET_CODE_ID = 'auth/SET_CODE_ID';
const SEND_EMAIL = 'auth/SEND_EMAIL';
const SEND_CODE = 'auth/SEND_CODE';
const REFRESH_TOKENS = 'auth/REFRESH_TOKENS';
const ERROR = 'auth/ERROR';
const LOGOUT = 'auth/LOGOUT';

export const initialState = {
    from: '/app',
    error: null,
    loading: false,
    email: null,
    code: null,
    codeId: null,
};

export default handleActions({
    [SET_EMAIL]: (state, { payload }) => ({ ...state, email: payload }),
    [SET_CODE]: (state, { payload }) => ({ ...state, code: payload }),
    [SEND_EMAIL]: state => ({ ...state, loading: true }),
    [SET_CODE_ID]: (state, { payload }) => ({ ...state, codeId: payload, loading: false }),
    [SEND_CODE]: state => ({ ...state, loading: true }),
    [ERROR]: (state, { payload }) => ({ ...state, error: payload, loading: false }),
    [SET_FROM]: (state, { payload }) => ({ ...state, from: payload }),
}, initialState);

export const setEmail = createAction(SET_EMAIL, email => email);
export const setCode = createAction(SET_CODE, code => code);
export const error = createAction(ERROR, error => error);
export const sendEmail = createAction(SEND_EMAIL, () => {});
export const sendCode = createAction(SET_CODE, () => {});
export const setCodeId = createAction(SET_CODE_ID, codeId => codeId);
export const refreshTokens = createAction(REFRESH_TOKENS, (cb = () => {}) => cb);
export const setFrom = createAction(SET_FROM, from => from);
export const logout = createAction(LOGOUT, () => {});

export const email = state => state.auth.email;
export const codeId = state => state.auth.codeId;
export const code = state => state.auth.code;
export const from = state => state.auth.from;