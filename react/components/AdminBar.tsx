import React, { ReactElement } from 'react';

function AdminBar(props): ReactElement {
    return (
        <div className="container">
            <div className="admin-bar">
                    {props.children}
            </div>
        </div>
    );
}

export default AdminBar;