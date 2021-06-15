import React from 'react';
import ReactDOM from 'react-dom';

import Application from './Application';
import { initialState } from './ducks'
import { currentScript } from './functions';

const state = {
    ...initialState,
}
// @ts-ignore
ReactDOM.render(<Application state={state} />, currentScript().parentNode);