import {combineReducers, Reducer} from 'redux';

export const initialState = {};

export default (router: any = null): Reducer => combineReducers({
    router
});