import React, { ReactElement } from 'react';

function AdminBar(props): ReactElement {
    return (
        <div className="admin-bar">
            <div className="container">
                {props.children}
            </div>
        </div>
    );
}

export default AdminBar;