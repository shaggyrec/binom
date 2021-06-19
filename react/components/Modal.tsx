import React from 'react';
import { Warning } from './Icons';
import Button from './Button';

function Modal({ type = 'info', onClickOk, ...props }) {
    return (
        <div className="overlay">
            <div className="overlay-content">
                <div className={'modal ' + type}>
                    <div className="modal-content">
                        <div className="modal-icon"><Warning /></div>
                        <p className="modal-text">{props.children}</p>
                        <div>
                            <Button block onClick={onClickOk}>Ok</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;