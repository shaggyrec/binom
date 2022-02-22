import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as authAction from '../ducks/auth'
import Button from '../components/Button';
import Paddingable from '../components/Paddingable';
import { RootState } from '../Application';
import * as applicationActions from '../ducks/application';
import * as usersActions from '../ducks/users';
import * as subscriptionsActions from '../ducks/subscriptions';
import * as topicsActions from '../ducks/topics';
import Loader from '../components/Loader';
import ReactMoment from 'react-moment';
import { useScroll } from '../hooks/useScroll';
import { useLocation } from 'react-router';
import { StarIcon } from '../components/Icons';
import UserSubscriptions from '../components/UserSubscriptions';
import { topic } from '../ducks/topics';

function Profile ({ logout, me, resetBackLink, user, match: { params: { username } }, requestUser,  loading, topics, requestTopics }): ReactElement {
    const [buy, scrollToBuy] = useScroll<HTMLDivElement>();
    const l = useLocation();

    useEffect(() => {
        if (l.hash === '#buy') {
            scrollToBuy();
        }
        resetBackLink();
        if (!user) {
            requestUser(username);
        }
    }, []);

    useEffect(() => {
        if (user && me && user.username === me.username && topic.length === 0) {
            requestTopics();
        }
    }, [user])

    return (
        user
            ? (
                <div className="container">
                    <Paddingable padding={[20, 0]}>
                        <div className="flex flex-between">
                            <div>
                                <div className="lg:flex gap-10">
                                    <h1 className="mb-0">{user.name || user.username}</h1>
                                    <Link to="/rating"><h2 className="text-green my-0"><StarIcon size={22} fill="#069668"/>{user.score}</h2></Link>
                                    {user.username === me.username && <h3 className="my-0">(это вы)</h3>}
                                </div>
                                {user && user.subscription && <h5 className="mt-0">&nbsp;{user.subscription.name} до <ReactMoment format="D.MM.YYYY" locale="ru">{user.subscription.expired}</ReactMoment></h5>}
                            </div>
                            {user.username === me.username && <Button small onClick={logout} className="px-20"><small>Выйти</small></Button>}
                        </div>
                    </Paddingable>
                    {user.username === me.username && me.subscriptions && (
                        <div ref={buy}>
                            <UserSubscriptions subscriptions={user.subscriptions} topics={topics}/>
                        </div>
                    )}
                    <Loader show={loading}/>
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
        subscriptions: state.subscriptions.list,
        loading: state.subscriptions.loading,
        topics: state.topics.list
    }),
    dispatch => ({
        logout: () => dispatch(authAction.logout()),
        resetBackLink: () => dispatch(applicationActions.backLink(null)),
        requestUser: username => dispatch(usersActions.requestUser(username)),
        requestSubscriptions: () => dispatch(subscriptionsActions.requestList()),
        requestTopics: () => dispatch(topicsActions.requestList()),
    })
)(Profile)