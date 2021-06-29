import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import * as authAction from '../ducks/auth'
import Button from '../components/Button';
import Paddingable from '../components/Paddingable';
import { RootState } from '../Application';

function Profile ({ logout, me }): ReactElement {
    return (
        <div className="container">
            <Paddingable padding={[20, 0]}>
                <h1>{me.name || me.username || me.email}</h1>
                <Button onClick={logout}>Выйти</Button>
            </Paddingable>
        </div>
    );
}

export default connect(
    (state: RootState) => ({
        me: state.users.me
    }),
    dispatch => ({
        logout: () => dispatch(authAction.logout())
    })
)(Profile)