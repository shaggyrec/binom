import React, { ReactElement } from 'react';

function TopBar(props): ReactElement {
    return (
        <div className="container">
            <div className="top-bar">
                    {props.children}
            </div>
        </div>
    );
}

export default TopBar;