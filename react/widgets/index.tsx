import React from 'react';
import ReactDOM from 'react-dom';

import RegForm from './regform';


const components = {
    RegForm
}

Object.keys(components).map(ComponentName => {
    window[ComponentName] = (opts, container) => {
        const componentContainer = document.querySelector(container);
        const Component = components[ComponentName];
        // @ts-ignore
        componentContainer && Component && ReactDOM.render(<Component {...opts}/>, componentContainer);
    }
});