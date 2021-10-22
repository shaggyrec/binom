import Paddingable from '../components/Paddingable';
import SpecialTariff from '../components/SpecialTariff';
import TariffsList from '../components/TariffsList';
import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import * as applicationActions from '../ducks/application';
import * as tariffsActions from '../ducks/tariffs';
import Loader from '../components/Loader';

function Buy({ tariffs, requestTariffs, requestSpecialTariff, onBuyTariff, buySpecialTariff, specialTariff, loading, me }): ReactElement {
    useEffect(() => {
        if (me) {
            tariffs.length === 0 && requestTariffs();
            specialTariff === null && requestSpecialTariff();
        }
    }, [me])
    return (
        <div className="container">
            <Paddingable padding={[0,10,0,0]}>
                <SpecialTariff tariff={specialTariff} onBuy={buySpecialTariff}/>
            </Paddingable>
            <TariffsList tariffs={tariffs} onBuy={onBuyTariff}/>
            <Loader show={loading} />
        </div>
    );
}

export default connect(
    (state: RootState) => ({
        me: state.users.me,
        tariffs: state.tariffs.list,
        loading: state.tariffs.loading,
        specialTariff: state.tariffs.special,
    }),
    dispatch => ({
        resetBackLink: () => dispatch(applicationActions.backLink(null)),
        requestTariffs: () => dispatch(tariffsActions.requestList()),
        onBuyTariff: (tariffId, priceId) => dispatch(tariffsActions.subscribe(tariffId, priceId)),
        requestSpecialTariff: () => dispatch(tariffsActions.requestSpecial()),
        buySpecialTariff: () => dispatch(tariffsActions.buySpecial()),
    })
)(Buy)