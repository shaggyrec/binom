import { handleActions, createAction } from 'redux-actions';

export const SET_LOADING = 'application/SET_LOADING';
export const MESSAGE = 'application/MESSAGE';
export const REMOVE_MESSAGE = 'application/REMOVE_MESSAGE';

export const initialState = {
    loading: true,
    message: null,
};

export default handleActions({
    [SET_LOADING]: (state, { payload }) => ({ ...state, loading: payload }),
    [MESSAGE]: (state, { payload }) => ({ ...state, message: payload }),
    [REMOVE_MESSAGE]: state => ({ ...state, message: null }),
}, initialState);

export const setLoading = createAction(SET_LOADING, (loading: boolean) => loading);
export const message = createAction(MESSAGE, message => message);
export const removeMessage = createAction(REMOVE_MESSAGE, () => {});