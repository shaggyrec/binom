import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import Notification from '../components/Notification';
import Paddingable from '../components/Paddingable';
import * as notificationsActions from '../ducks/notifications';

function Notifications({ notifications, setViewed }): ReactElement {
    return (
        <div className="container py-20">
            {notifications.map(n => (
                <Paddingable key={n.notification.id} padding={[10, 0]}>
                    <Notification notification={n.notification} viewed={n.viewed} onClick={() => setViewed(n.id)}/>
                </Paddingable>
            ))}
        </div>
    );
}

export default connect(
    (state: RootState) => ({
        notifications: state.notifications.list
    }),
    dispatch => ({
        setViewed: id => dispatch(notificationsActions.setViewed(id))
    })
)(Notifications);