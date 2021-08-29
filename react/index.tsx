import React from 'react';
import ReactDOM from 'react-dom';
import 'moment/locale/ru';
import './css/styles.css'

import Application from './Application';
import { initialState } from './ducks'

const ROOT_APP_CLASSNAME = 'binomapp'

const state = {
    ...initialState,
}
const appContainer = document.createElement('div');
appContainer.id = ROOT_APP_CLASSNAME;
document.body.appendChild(appContainer);
// @ts-ignore
ReactDOM.render(<Application state={state} />, appContainer);