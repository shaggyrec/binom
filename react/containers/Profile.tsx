import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as authAction from '../ducks/auth'
import Button from '../components/Button';
import Paddingable from '../components/Paddingable';
import { RootState } from '../Application';
import * as applicationActions from '../ducks/application';

function Profile ({ logout, me, resetBackLink }): ReactElement {
    useEffect(() => {
        resetBackLink();
    }, []);
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
        logout: () => dispatch(authAction.logout()),
        resetBackLink: () => dispatch(applicationActions.backLink(null)),
    })
)(Profile)