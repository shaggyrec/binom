import React from 'react';
import { ConnectedRouter, connectRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';

import rootReducer from './ducks';
import rootSaga from './sagas';
import configureStore from './store';
import Header from './containers/Header';
import Root from './containers/Root';


const history = createBrowserHistory();
const router = connectRouter(history);
const sagas = createSagaMiddleware();

let store;

function Application ({ state = {} }) {
    store = configureStore(rootReducer(router), state, history, sagas)
    sagas.run(rootSaga);

    return (
        <Provider store={store}>
            <Header />
            <ConnectedRouter history={history}>
                <Root />
            </ConnectedRouter>
        </Provider>
    );
}

export type RootState = ReturnType<typeof store.getState>;
export default Application;