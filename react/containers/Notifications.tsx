import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import Notification from '../components/Notification';

function Notifications({ notifications }): ReactElement {
    return (
        <div className="container">
            {notifications.map(n => <Notification key={n.id} notification={n.notification} />)}
        </div>
    );
}

export default connect(
    (state: RootState) => ({
        notifications: state.notifications.list
    })
)(Notifications);