import { handleActions, createAction } from 'redux-actions';
import { BackLink } from '../dataTypes/backLink';

export const SET_LOADING = 'application/SET_LOADING';
export const MESSAGE = 'application/MESSAGE';
export const ERROR = 'application/ERROR';
export const REMOVE_MESSAGE = 'application/REMOVE_MESSAGE';
export const BACK_LINK = 'application/BACK_LINK';

export const initialState = {
    loading: true,
    message: null,
    backLink: null
};

export default handleActions({
    [SET_LOADING]: (state, { payload }) => ({ ...state, loading: payload }),
    [MESSAGE]: (state, { payload }) => ({ ...state, message: payload }),
    [ERROR]: (state, { payload }) => ({ ...state, message: { type: 'error', text: payload } }),
    [REMOVE_MESSAGE]: state => ({ ...state, message: null }),
    [BACK_LINK]: (state, { payload }) => ({ ...state, backLink: payload }),
}, initialState);

export const setLoading = createAction(SET_LOADING, (loading: boolean) => loading);
export const message = createAction(MESSAGE, message => message);
export const error = createAction(ERROR, message => message);
export const removeMessage = createAction(REMOVE_MESSAGE, () => {});
export const backLink = createAction(BACK_LINK, (link: BackLink|null) => link)