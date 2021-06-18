import { handleActions, createAction } from 'redux-actions';

export const SET_LOADING = 'application/SET_LOADING';

export const initialState = {
    loading: true
};

export default handleActions({
    [SET_LOADING]: (state, { payload }) => ({ ...state, loading: payload })
}, initialState);

export const setLoading = createAction(SET_LOADING, (loading: boolean) => loading);