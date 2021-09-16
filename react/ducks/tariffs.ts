import { handleActions, createAction } from 'redux-actions';

const REQUEST_LIST = 'tariffs/REQUEST_LIST';
const REQUEST_SPECIAL_TARIFF = 'tariffs/REQUEST_SPECIAL_TARIFF';
const SPECIAL_TARIFF = 'tariffs/SPECIAL_TARIFF';
const LIST = 'tariffs/LIST';
const CREATE = 'tariffs/CREATE';
const UPDATE = 'tariffs/UPDATE';
const DELETE = 'tariffs/DELETE';
const SUCCESS = 'tariffs/SUCCESS';
const ERROR = 'tariffs/ERROR';
const CREATE_PRICE = 'tariffs/CREATE_PRICE';
const UPDATE_PRICE = 'tariffs/UPDATE_PRICE';
const REMOVE_PRICE = 'tariffs/REMOVE_PRICE';
const SUBSCRIBE = 'tariffs/SUBSCRIBE';
const BUY_SPECIAL = 'tariffs/BUY_SPECIAL';

export const initialState = {
    list: [],
    special: null,
    loading: false,
    error: null
};

export default handleActions({
    [REQUEST_LIST]: state => ({ ...state, loading: true }),
    [LIST]: (state, { payload }) => ({ ...state, loading: false, list: payload }),
    [CREATE]: (state) => ({ ...state, loading: true }),
    [DELETE]: (state) => ({ ...state, loading: true }),
    [CREATE_PRICE]: (state) => ({ ...state, loading: true }),
    [REMOVE_PRICE]: (state) => ({ ...state, loading: true }),
    [SUCCESS]: (state) => ({ ...state, loading: false }),
    [SUBSCRIBE]: (state) => ({ ...state, loading: true }),
    [ERROR]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
    [SPECIAL_TARIFF]: (state, { payload }) => ({ ...state, loading: false, special: payload }),
}, initialState);

export const requestList = createAction(REQUEST_LIST, () => ({}));
export const setList = createAction(LIST, list => list);
export const create = createAction(CREATE, s => s);
export const update = createAction(UPDATE, (id, subscription) => ({ id, subscription }));
export const remove = createAction(DELETE, id => id);
export const success = createAction(SUCCESS, () => ({}));
export const error = createAction(ERROR, e => e);
export const createPrice = createAction(CREATE_PRICE, (tariffId, price) => ({ tariffId, price }));
export const updatePrice = createAction(UPDATE_PRICE, (tariffId, id, price) => ({ tariffId, id, price }));
export const removePrice = createAction(REMOVE_PRICE, (tariffId, id) => ({ tariffId, id }));
export const subscribe = createAction(SUBSCRIBE, (tariffId, priceId) => ({ tariffId, priceId }));
export const requestSpecial = createAction(REQUEST_SPECIAL_TARIFF, () => ({}));
export const setSpecial = createAction(SPECIAL_TARIFF, t => t);
export const buySpecial = createAction(BUY_SPECIAL, () => ({}));


export const tariffsList = state => state.tariffs.list;
