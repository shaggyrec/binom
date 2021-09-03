import React, { ReactElement } from 'react';

export default function Paddingable ({ padding, ...props }): ReactElement {
    return <div className={props.className} style={{ padding: padding.join('px ') + 'px' }}>{props.children}</div>;
}