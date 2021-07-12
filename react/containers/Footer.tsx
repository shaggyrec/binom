import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import BottomNavigation from '../components/BottomNavigation';
import { UserRole } from '../dataTypes/user';

function Footer({ me }): ReactElement {
    return me ? <BottomNavigation username={me.username}/> : null;
}
export default connect(
    (state: RootState) => ({
        me: state.users.me,
    })
)(Footer);