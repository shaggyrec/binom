import { handleActions, createAction } from 'redux-actions';

const REQUEST = 'usersRating/REQUEST';
const SET = 'usersRating/SET';

export const initialState = {
    rating: null,
    loading: false
};

export default handleActions({
    [REQUEST]: state => ({ ...state, loading: true }),
    [SET]: (state, { payload }) => ({ ...state, loading: false, rating: payload }),
}, initialState);


export const request = createAction(REQUEST, () => ({}));
export const set = createAction(SET, r => r);