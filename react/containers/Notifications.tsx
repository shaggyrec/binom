import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import Notification from '../components/Notification';
import Paddingable from '../components/Paddingable';
import * as notificationsActions from '../ducks/notifications';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { Add } from '../components/Icons';

function Notifications({ notifications, setViewed, requestNotifications, loading, noMore }): ReactElement {
    function handleClickButton() {
        requestNotifications(notifications.length);
    }
    return (
        <>
            <div className="container py-20">
                {notifications.map(n => (
                    <Paddingable key={n.notification.id} padding={[10, 0]}>
                        <Notification notification={n.notification} viewed={n.viewed} onClick={() => setViewed(n.id)}/>
                    </Paddingable>
                ))}
                <div className="py-20 text-center">
                    {!noMore && <Button onClick={handleClickButton}><Add size={13}/>&nbsp;&nbsp;<span>Ещё</span></Button>}
                </div>
            </div>
            <Loader show={loading}/>
        </>
    );
}

export default connect(
    (state: RootState) => ({
        notifications: state.notifications.list,
        loading: state.notifications.loading,
        noMore: state.notifications.noMore,
    }),
    dispatch => ({
        setViewed: id => dispatch(notificationsActions.setViewed(id)),
        requestNotifications: offset => dispatch(notificationsActions.requestList(50, offset))
    })
)(Notifications);