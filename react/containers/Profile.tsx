import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import * as authAction from '../ducks/auth'
import Button from '../components/Button';
import Paddingable from '../components/Paddingable';
import { RootState } from '../Application';
import * as applicationActions from '../ducks/application';
import * as usersActions from '../ducks/users';
import * as tariffsActions from '../ducks/tariffs';
import Loader from '../components/Loader';
import TariffsList from '../components/TariffsList';
import ReactMoment from 'react-moment';

function Profile ({ logout, me, resetBackLink, user, match: { params: { username } }, requestUser, requestTariffs, tariffs, onBuyTariff, loading }): ReactElement {
    useEffect(() => {
        resetBackLink();
        if (!user) {
            requestUser(username);
        }
        requestTariffs()
    }, []);

    return (
        user
            ? (
                <div className="container">
                    <Paddingable padding={[20, 0]}>
                        <div className="flex flex-between">
                            <div>
                                <div className="flex">
                                    <h1 className="mb-0">{user.name || user.username}</h1>
                                    {user.username === me.username && <h3 className="mb-0">&nbsp;(это вы)</h3>}
                                </div>
                                {user.username === me.username && me.subscription && <h5 className="mt-0">&nbsp;{me.subscription.name} до <ReactMoment format="D.MM.YYYY" locale="ru">{me.subscription.expired}</ReactMoment></h5>}
                            </div>
                            {user.username === me.username && <Button small onClick={logout}><small>Выйти</small></Button>}
                        </div>
                    </Paddingable>
                    {user.username === me.username && !me.subscription && <TariffsList tariffs={tariffs} onBuy={onBuyTariff}/>}
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
        tariffs: state.tariffs.list,
        loading: state.tariffs.loading,
    }),
    dispatch => ({
        logout: () => dispatch(authAction.logout()),
        resetBackLink: () => dispatch(applicationActions.backLink(null)),
        requestUser: username => dispatch(usersActions.requestUser(username)),
        requestTariffs: () => dispatch(tariffsActions.requestList()),
        onBuyTariff: (tariffId, priceId) => dispatch(tariffsActions.subscribe(tariffId, priceId)),
    })
)(Profile)