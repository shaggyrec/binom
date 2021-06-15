import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore, Reducer, Store } from 'redux';
import { SagaMiddleware } from 'redux-saga';
import { BrowserHistory } from 'history';

export default function configureStore(rootReducer: Reducer, initialState: object, history: BrowserHistory, sagas: SagaMiddleware): Store {
    let middlewares = [];

    if(sagas) {
        middlewares.push(sagas);
    }
    if(history) {
        middlewares.push(routerMiddleware(history));
    }

    return createStore(
        rootReducer,
        initialState || {},
        applyMiddleware(...middlewares)
    );
}