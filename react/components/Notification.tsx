import React, { ReactElement } from 'react';

function Notification({ notification }): ReactElement {
    return <div className="neomorphic">{notification.message} {notification.created}</div>;
}
export default Notification;