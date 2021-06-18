import ProtectedRoute from 'react-route-protected';
import React, { ReactElement, useEffect } from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';

import { history, RootState } from '../Application';
import Home from './Home';
import Auth from './Auth';
import { getTokens } from '../tokens';
import { requestMe } from '../ducks/users';
import { setFrom } from '../ducks/auth';
import { setLoading } from '../ducks/application';
import BottomMenu from './BottomMenu';
import Header from './Header';

function Root({ history, me, requestMe, setFrom, loading, setLoading }): ReactElement {
    useEffect(() => {
        setFrom(history.location.state?.from || '/');
        const [t, rt] = getTokens()
        if (!me) {
            (t && rt) ? requestMe() : setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>Loading</div>;
    }

    return (
        <div className="container root">
            <Header />
            <Switch>
                <Route path="/auth" component={Auth}/>
                {/* @ts-ignore */}
                <ProtectedRoute exact path="/app" component={Home} isAuthorized={!!me} authPath="/auth"/>
            </Switch>
            <BottomMenu />
        </div>
    );
}

export default connect(
    (state: RootState) => ({
        me: state.users.me,
        loading: state.application.loading
    }),
    dispatch => ({
        requestMe: () => dispatch(requestMe()),
        setFrom: from => dispatch(setFrom(from)),
        setLoading: l => dispatch(setLoading(l)),
    })
)(Root);