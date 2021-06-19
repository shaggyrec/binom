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
import { removeMessage, setLoading } from '../ducks/application';
import BottomMenu from './Footer';
import Header from './Header';
import ControlPanel from './ControlPanel';
import { UserRole } from '../dataTypes/user';
import CreateTopic from './CreateTopic';
import Modal from '../components/Modal';
import { ApplicationMessageType } from '../dataTypes/applicationMessage';
import TopicOverview from './TopicOverview';

function Root({ history, me, requestMe, setFrom, loading, setLoading, hideModal, message }): ReactElement {
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
                <ProtectedRoute exact path="/app" component={Home} isAuthorized={!!me} authPath="/auth"/>
                <ProtectedRoute component={ControlPanel} isAuthorized={me?.role === UserRole.admin} path="/cp" exact authPath="/auth" />
                <ProtectedRoute component={CreateTopic} isAuthorized={me?.role === UserRole.admin} path="/topic/create" exact authPath="/auth" />
                <ProtectedRoute component={TopicOverview} isAuthorized={me?.role === UserRole.admin} path="/topic/:alias" exact authPath="/auth" />
            </Switch>
            <BottomMenu />
            {message && <Modal type={message.type || ApplicationMessageType.info} onClickOk={hideModal}>{message.text}</Modal>}
        </div>
    );
}

export default connect(
    (state: RootState) => ({
        me: state.users.me,
        loading: state.application.loading,
        message: state.application.message,
    }),
    dispatch => ({
        requestMe: () => dispatch(requestMe()),
        setFrom: from => dispatch(setFrom(from)),
        setLoading: l => dispatch(setLoading(l)),
        hideModal: () => dispatch(removeMessage())
    })
)(Root);