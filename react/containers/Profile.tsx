import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
import { useScroll } from '../hooks/useScroll';
import { useLocation } from 'react-router';
import { StarIcon } from '../components/Icons';
import SpecialTariff from '../components/SpecialTariff';

function Profile ({ logout, me, resetBackLink, user, match: { params: { username } }, requestUser, requestTariffs,
    tariffs, onBuyTariff, loading, requestSpecialTariff, specialTariff, buySpecialTariff }): ReactElement {
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
        requestTariffs();

    }, []);

    useEffect(() => {
        if (user.username === me.username && !me.subscription && !specialTariff) {
            requestSpecialTariff();
        }
    }, [user])

    return (
        user
            ? (
                <div className="container">
                    <Paddingable padding={[20, 0]}>
                        <div className="flex flex-between">
                            <div>
                                <div className="flex gap-10">
                                    <h1 className="mb-0">{user.name || user.username}</h1>
                                    <Link to="/rating"><h2 className="text-green"><StarIcon size={22} fill="#069668"/>{user.score}</h2></Link>
                                    {user.username === me.username && <h3 className="mb-0">(это вы)</h3>}
                                </div>
                                {user && user.subscription && <h5 className="mt-0">&nbsp;{user.subscription.name} до <ReactMoment format="D.MM.YYYY" locale="ru">{user.subscription.expired}</ReactMoment></h5>}
                            </div>
                            {user.username === me.username && <Button small onClick={logout} className="px-20"><small>Выйти</small></Button>}
                        </div>
                    </Paddingable>
                    {user.username === me.username && !me.subscription && (
                        <div ref={buy}>
                            <Paddingable padding={[0,10,0,0]}>
                                <SpecialTariff tariff={specialTariff} onBuy={buySpecialTariff}/>
                            </Paddingable>
                            <TariffsList tariffs={tariffs} onBuy={onBuyTariff}/>
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
        tariffs: state.tariffs.list,
        loading: state.tariffs.loading,
        specialTariff: state.tariffs.special,
    }),
    dispatch => ({
        logout: () => dispatch(authAction.logout()),
        resetBackLink: () => dispatch(applicationActions.backLink(null)),
        requestUser: username => dispatch(usersActions.requestUser(username)),
        requestTariffs: () => dispatch(tariffsActions.requestList()),
        onBuyTariff: (tariffId, priceId) => dispatch(tariffsActions.subscribe(tariffId, priceId)),
        requestSpecialTariff: () => dispatch(tariffsActions.requestSpecial()),
        buySpecialTariff: () => dispatch(tariffsActions.buySpecial()),
    })
)(Profile)