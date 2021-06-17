import ProtectedRoute from 'react-route-protected';
import React, { ReactElement, useEffect } from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';

import { RootState } from '../Application';
import Home from './Home';
import Auth from './Auth';
import { getTokens } from '../tokens';
import { requestMe } from '../ducks/users';

function Root({ me, requestMe }): ReactElement {
    useEffect(() => {
        const [t, rt] = getTokens()
        if (!me && t && rt) {
            requestMe();
        }
    }, []);
    // TODO implement loading until requestMe response
    return (
        <Switch>
            <Route path="/auth" component={Auth}/>
            {/* @ts-ignore */}
            <ProtectedRoute exact path="/app" component={Home} isAuthorized={me} authPath="/auth"/>
        </Switch>
    );
}

export default connect(
    (state: RootState) => ({ me: state.users.me }),
    dispatch => ({
        requestMe: () => dispatch(requestMe())
    })
)(Root);