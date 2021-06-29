import React, { ReactElement } from 'react';

function Button(props): ReactElement {
    const className = [
        props.className,
        props.green && "button-green",
        props.block && "block",
        props.small && "button-small",
        props.red && 'button-red'
    ].filter(c => c).join(' ')
    return (
        <button
            type={props.type || 'submit'}
            className={className}
            onClick={props.onClick || (() => {})}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );
}

export default Button;