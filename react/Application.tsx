import React from 'react';
import { ConnectedRouter, connectRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';

import rootReducer from './ducks';
import rootSaga from './sagas';
import configureStore from './store';
import Root from './containers/Root';


export const history = createBrowserHistory();
const router = connectRouter(history);
const sagas = createSagaMiddleware();

let store;

function Application ({ state = {} }) {
    store = configureStore(rootReducer(router), state, history, sagas)
    sagas.run(rootSaga);

    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Root history={history}/>
            </ConnectedRouter>
        </Provider>
    );
}

export type RootState = ReturnType<typeof store.getState>;
export default Application;