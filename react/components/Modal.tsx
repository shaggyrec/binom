import React from 'react';
import { Warning } from './Icons';
import Button from './Button';

function Modal({ type = 'info', onClickOk, onClickCancel = null, ...props }) {
    return (
        <div className="overlay">
            <div className="overlay-content">
                <div className={'modal ' + type}>
                    <div className="modal-content">
                        <div className="modal-icon"><Warning /></div>
                        <p className="modal-text">{props.children}</p>
                        <div className="flex">
                            {onClickCancel && <Button block onClick={onClickCancel}>Cancel</Button>}
                            <Button block green={!!onClickCancel} onClick={onClickOk}>Ok</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;