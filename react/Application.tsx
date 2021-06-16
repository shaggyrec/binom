import React from 'react';
import { ConnectedRouter, connectRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './ducks';
import rootSaga from './sagas';
import configureStore from './store';
import { createBrowserHistory } from 'history';
import { Route, Switch } from 'react-router-dom';

import Home from './containers/Home';
import Header from './containers/Header';


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
                <Switch>
                    <Route path="/app" component={Home}/>
                </Switch>
            </ConnectedRouter>
        </Provider>
    );
}

export type RootState = ReturnType<typeof store.getState>;
export default Application;