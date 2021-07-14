import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import BottomNavigation from '../components/BottomNavigation';
import { UserRole } from '../dataTypes/user';

function Footer({ me, newNotificationsAmount }): ReactElement {
    return me ? <BottomNavigation username={me.username} notificationsAmount={newNotificationsAmount}/> : null;
}
export default connect(
    (state: RootState) => ({
        me: state.users.me,
        newNotificationsAmount: state.notifications.list.filter(n => n.viewed === false).length
    })
)(Footer);