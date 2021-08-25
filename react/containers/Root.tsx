import ProtectedRoute from 'react-route-protected';
import React, { ReactElement, useEffect } from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';

import { RootState } from '../Application';
import Home from './Home';
import Auth from './Auth';
import { getTokens } from '../tokens';
import { requestMe } from '../ducks/users';
import { setFrom } from '../ducks/auth';
import { removeMessage, setLoading } from '../ducks/application';
import BottomMenu from './Footer';
import Header from './Header';
import { UserRole } from '../dataTypes/user';
import TopicCreate from './TopicCreate';
import Modal from '../components/Modal';
import { ApplicationMessageType } from '../dataTypes/applicationMessage';
import TopicOverview from './TopicOverview';
import Loader from '../components/Loader';
import LessonCreate from './LessonCreate';
import LessonOverview from './LessonOverview';
import LessonEdit from './LessonEdit';
import Profile from './Profile';
import CompleteProfile from './CompleteProfile';
import NotFoundPage from '../components/NotFoundPage';
import Notifications from './Notifications';
import SubscriptionsManager from './SubscriptionsManager';

function Root({ history, me, requestMe, setFrom, loading, setLoading, hideModal, message }): ReactElement {
    useEffect(() => {
        setFrom(history.location.state?.from || '/app');
        const [t, rt] = getTokens()
        if (!me) {
            (t && rt) ? requestMe() : setLoading(false);
        }
    }, []);

    if (loading) {
        return <Loader />;
    }

    function app() {
        if (me && !me.username) {
            return <CompleteProfile />;
        }
        return (
            <>
                <Header />
                <Switch>
                    <Route path="/auth" component={Auth}/>
                    <ProtectedRoute exact path="/app" component={Home} isAuthorized={!!me} authPath="/auth"/>
                    <ProtectedRoute exact path="/@:username" component={Profile} isAuthorized={!!me} authPath="/auth"/>
                    <ProtectedRoute component={LessonCreate} isAuthorized={me?.role === UserRole.admin} path="/lesson/create" exact authPath="/auth" />
                    <ProtectedRoute exact path="/lesson/:alias" component={LessonOverview} isAuthorized={!!me} authPath="/auth"/>
                    <ProtectedRoute exact path="/lesson/:alias/edit" component={LessonEdit} isAuthorized={me?.role === UserRole.admin} authPath="/auth"/>
                    <ProtectedRoute component={TopicCreate} isAuthorized={me?.role === UserRole.admin} path="/topic/create" exact authPath="/auth" />
                    <ProtectedRoute component={TopicOverview} isAuthorized={me?.role === UserRole.admin} path="/topic/:alias" exact authPath="/auth" />
                    <ProtectedRoute component={LessonOverview} isAuthorized={me?.role === UserRole.admin} path="/@:username/lesson/:alias" exact authPath="/auth" />
                    <ProtectedRoute component={Notifications} isAuthorized={!!me} path="/notifications" exact authPath="/auth" />
                    <ProtectedRoute component={SubscriptionsManager} isAuthorized={me?.role === UserRole.admin} path="/subscriptions/edit" exact authPath="/auth" />
                    <Route path="*" component={NotFoundPage} />
                </Switch>
                <BottomMenu />
            </>
        );
    }

    return (
        <div className="root">
            {app()}
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