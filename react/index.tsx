import React from 'react';
import ReactDOM from 'react-dom';

import Application from './Application';
import { initialState } from './ducks'

const ROOT_APP_CLASSNAME = 'binomapp'

const state = {
    ...initialState,
}
const appContainer = document.createElement('div');
appContainer.id = 'binomapp';
document.body.appendChild(appContainer);
// @ts-ignore
ReactDOM.render(<Application state={state} />, appContainer);