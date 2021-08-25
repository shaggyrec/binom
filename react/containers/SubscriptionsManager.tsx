import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import * as subscriptionsActions from '../ducks/subscriptions';
import { RootState } from '../Application';
import SubscriptionEditCard from '../components/SubscriptionEditCard';

function SubscriptionsManager({ subscriptions, requestSubscriptions, create, update }): ReactElement {
    useEffect(() => {
        requestSubscriptions()
    }, []);

    function handleCreateSubscription (): void {
        create('Подписка #' + (subscriptions.length + 1), 999, 1);
    }

    return (
        <div className="container py-20">
            <div className="flex gap-20 flex-wrap">
                {subscriptions.map(s =>(
                    <SubscriptionEditCard
                        key={`subscription${s.id}`}
                        {...s}
                        onChange={updated => update(s.id, updated)}
                    />
                ))}
            </div>
            <div className="py-20">
                <button onClick={handleCreateSubscription}>Добавить подписку</button>
            </div>
        </div>
    );
}

export default connect(
    (state: RootState) => ({
        subscriptions: state.subscriptions.list
    }),
    dispatch => ({
        requestSubscriptions: () => dispatch(subscriptionsActions.requestList()),
        create: (name, price, duration) => dispatch(subscriptionsActions.create({ name, price, duration })),
        update: (id, s) => dispatch(subscriptionsActions.update(id, s))
    })
)(SubscriptionsManager);