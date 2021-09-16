import { call, delay, ForkEffect, put, select, takeEvery, takeLatest } from '@redux-saga/core/effects';
import * as tariffsActions from '../ducks/tariffs';
import * as applicationActions from '../ducks/application';
import { apiRequest } from './index';
import { getApiErrorMessage, goToYoomoney } from '../functions';
import { characterEntitiesHtml4 } from 'character-entities-html4';

function* requestListProcess(): IterableIterator<any> {
    try {
        const tariffs = yield call(apiRequest,'/api/tariff');
        yield put(tariffsActions.setList(tariffs));
    } catch (e) {
        const error = getApiErrorMessage(e);
        yield put(tariffsActions.error(error));
        yield put(applicationActions.error(error));
    }
}

function* createProcess({ payload }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/tariff', 'post', payload);
        yield put(tariffsActions.requestList());
    } catch (e) {
        const error = getApiErrorMessage(e);
        yield put(tariffsActions.error(error));
        yield put(applicationActions.error(error));
    }
}

function* updateProcess({ payload: { id, subscription } }): IterableIterator<any> {
    yield delay(1000);
    try {
        yield call(apiRequest, '/api/tariff/' + id, 'put', subscription);
        yield put(tariffsActions.success());
    } catch (e) {
        console.log(e);
        const error = getApiErrorMessage(e);
        yield put(tariffsActions.error(error));
        yield put(applicationActions.error(error));
    }
}

function* removeProcess({ payload }): IterableIterator<any> {
    try {
        yield call(apiRequest, '/api/tariff/' + payload, 'delete');
        yield put(tariffsActions.requestList());
    } catch (e) {
        console.log(e);
        const error = getApiErrorMessage(e);
        yield put(tariffsActions.error(error));
        yield put(applicationActions.error(error));
    }
}

function* createPriceProcess({ payload }): IterableIterator<any> {
    try {
        const { tariffId, price } = payload;
        const newPrice = yield call(apiRequest, '/api/tariff/' + tariffId + '/price', 'POST', price);
        const tariffsList: any[] = yield select(tariffsActions.tariffsList);
        yield put(tariffsActions.setList(
            tariffsList.map(
                t => t.id === tariffId
                    ? { ...t, prices: [...(t.prices || []), newPrice] }
                    : t
            )
        ));

    } catch (e) {
        console.log(e);
        const error = getApiErrorMessage(e);
        yield put(tariffsActions.error(error));
        yield put(applicationActions.error(error));
    }
}

function* updatePriceProcess({ payload }): IterableIterator<any> {
    yield delay(1000);
    try {
        const { tariffId, id, price } = payload;
        yield call(apiRequest, '/api/tariff/' + tariffId + '/price/' + id, 'PUT', price);
        yield put(tariffsActions.success());
    } catch (e) {
        console.log(e);
        const error = getApiErrorMessage(e);
        yield put(tariffsActions.error(error));
        yield put(applicationActions.error(error));
    }
}

function* removePriceProcess({ payload }): IterableIterator<any> {
    try {
        const { tariffId, id } = payload;
        yield call(apiRequest, '/api/tariff/' + tariffId + '/price/' + id, 'delete');

        const tariffsList: any[] = yield select(tariffsActions.tariffsList);

        yield put(tariffsActions.setList(
            tariffsList.map(
                t => t.id === tariffId
                    ? { ...t, prices: t.prices.filter(p => p.id !== id) }
                    : t
            )
        ));

    } catch (e) {
        console.log(e);
        const error = getApiErrorMessage(e);
        yield put(tariffsActions.error(error));
        yield put(applicationActions.error(error));
    }
}

function* subscribeProcess({ payload: { tariffId, priceId } }): IterableIterator<any> {
    try {
        goToYoomoney(yield call(apiRequest, '/api/tariff/' + tariffId + '/price/' + priceId + '/buy'));
    } catch (e) {
        const error = getApiErrorMessage(e);
        yield put(tariffsActions.error(error));
        yield put(applicationActions.error(error));
    }
}

function* requestSpecialProcess(): IterableIterator<any> {
    try {
        const t = yield call(apiRequest, '/api/tariff/special');
        yield put(tariffsActions.setSpecial(t));
    } catch (e) {
        yield put(tariffsActions.setSpecial(false));
    }
}

function* buySpecialProcess(): IterableIterator<any> {
    try {
        goToYoomoney(yield call(apiRequest, '/api/tariff/special/buy'));
    } catch (e) {
        const error = getApiErrorMessage(e);
        yield put(tariffsActions.error(error));
        yield put(applicationActions.error(error));
    }
}

export function* tariffs(): IterableIterator<ForkEffect> {
    yield takeEvery(tariffsActions.requestList, requestListProcess);
    yield takeEvery(tariffsActions.create, createProcess);
    yield takeLatest(tariffsActions.update, updateProcess);
    yield takeEvery(tariffsActions.remove, removeProcess);
    yield takeEvery(tariffsActions.createPrice, createPriceProcess);
    yield takeLatest(tariffsActions.updatePrice, updatePriceProcess);
    yield takeEvery(tariffsActions.removePrice, removePriceProcess);
    yield takeLatest(tariffsActions.subscribe, subscribeProcess);
    yield takeLatest(tariffsActions.requestSpecial, requestSpecialProcess);
    yield takeLatest(tariffsActions.buySpecial, buySpecialProcess);

}