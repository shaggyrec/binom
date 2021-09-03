import React, { ReactElement, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as tariffsActions from '../ducks/tariffs';
import { RootState } from '../Application';
import TariffEditCard from '../components/TariffEditCard';
import { Back } from '../components/Icons';
import TopBar from '../components/TopBar';
import Loader from '../components/Loader';

function TariffsManager({ tariffs, requestTariffs, create, update, remove, createPrice, updatePrice, removePrice, loading }): ReactElement {
    useEffect(() => {
        requestTariffs()
    }, []);

    function handleCreateTariff (): void {
        create('Подписка #' + (tariffs.length + 1), 999, 1);
    }

    return (
        <>
            <TopBar>
                <Link to={'/app'}>
                    <Back size={25}/>
                </Link>
            </TopBar>
            <div className="container py-20">
                <div className="flex gap-20 flex-wrap">
                    {tariffs.map(t =>(
                        <TariffEditCard
                            key={`tariff-manager${t.id}`}
                            {...t}
                            onChange={updated => update(t.id, updated)}
                            onDelete={() => remove(t.id)}
                            onAddPrice={p => createPrice(t.id, p)}
                            onChangePrice={(id, p) => updatePrice(t.id, id, p)}
                            onDeletePrice={id => removePrice(t.id, id)}
                        />
                    ))}
                </div>
                <div className="py-20">
                    <button onClick={handleCreateTariff}>Добавить тариф</button>
                </div>
                <Loader show={loading} />
            </div>
        </>
    );
}

export default connect(
    (state: RootState) => ({
        tariffs: state.tariffs.list,
        loading: state.tariffs.loading
    }),
    dispatch => ({
        requestTariffs: () => dispatch(tariffsActions.requestList()),
        create: (name, price, duration) => dispatch(tariffsActions.create({ name, price, duration })),
        update: (id, s) => dispatch(tariffsActions.update(id, s)),
        remove: id => dispatch(tariffsActions.remove(id)),
        createPrice: (tariffId, price) => dispatch(tariffsActions.createPrice(tariffId, price)),
        updatePrice: (tariffId, id, price) => dispatch(tariffsActions.updatePrice(tariffId, id, price)),
        removePrice: (tariffId, id) => dispatch(tariffsActions.removePrice(tariffId, id)),
    })
)(TariffsManager);