import React, { ReactElement } from 'react';

interface ButtonProps {
    className?: string;
    green?: boolean;
    block?: boolean;
    small?: boolean;
    red?: boolean;
    disabled?: boolean;
    onClick?: (any: any) => any;
    type?: 'button'|'submit'|'reset';
    children?: any;
}

function Button(props: ButtonProps): ReactElement {
    const className = [
        props.className,
        props.green && 'button-green',
        props.block && 'block',
        props.small && 'button-small',
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