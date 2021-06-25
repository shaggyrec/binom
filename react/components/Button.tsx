import React, { ReactElement } from 'react';

function Button(props): ReactElement {
    const className = [
        props.className,
        props.green && "button-green",
        props.block && "block",
        props.small && "button-small"
    ].filter(c => c).join(' ')
    return (
        <button
            className={className}
            onClick={props.onClick || (() => {})}
        >
            {props.children}
        </button>
    );
}

export default Button;