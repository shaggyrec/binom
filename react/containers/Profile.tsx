import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as authAction from '../ducks/auth'
import Button from '../components/Button';
import Paddingable from '../components/Paddingable';
import { RootState } from '../Application';
import * as applicationActions from '../ducks/application';
import * as usersActions from '../ducks/users';
import Loader from '../components/Loader';

function Profile ({ logout, me, resetBackLink, user, match: { params: { username } }, requestUser }): ReactElement {
    useEffect(() => {
        resetBackLink();
        if (!user) {
            requestUser(username);
        }
    }, []);

    return (
        user
            ? (
                <div className="container">
                    <Paddingable padding={[20, 0]}>
                        <div className="flex">
                            <h1>{user.name || user.username}</h1>
                            {user.username === me.username && <h3>&nbsp;(это вы)</h3>}
                        </div>
                        {user.username === me.username && <Button onClick={logout}>Выйти</Button>}
                    </Paddingable>
                </div>
            )
            : <Loader show />
    );
}


export default connect(
    (state: RootState, props) => ({
        me: state.users.me,
        // @ts-ignore
        user: props.match.params?.username === state.users.me?.username ? state.users.me : state.users.current,
    }),
    dispatch => ({
        logout: () => dispatch(authAction.logout()),
        resetBackLink: () => dispatch(applicationActions.backLink(null)),
        requestUser: username => dispatch(usersActions.requestUser(username)),
    })
)(Profile)