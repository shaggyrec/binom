import React, { ReactElement } from 'react';

function Button({ ...props }): ReactElement {
    return (<button className={props.className}>{props.children}</button>);
}

export default Button;