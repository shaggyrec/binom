import React from 'react';
import { Cancel, Warning } from './Icons';

function Modal({ type = 'info', ...props }) {
    return (
        <div className="overlay">
            <div className="modal">
                <div><Warning /></div>
                <p>{props.children}</p>
            </div>
        </div>
    );
}

export default Modal;