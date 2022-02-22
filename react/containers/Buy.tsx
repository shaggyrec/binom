import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import * as subscriptionsActions from '../ducks/subscriptions';
import * as topicsActions from '../ducks/topics';
import Loader from '../components/Loader';
import TopicsPurchase from '../components/TopicsPurchase';
import useQueryString from '../hooks/useQueryString';
import { TopicStatus } from '../dataTypes/topic';

function Buy({ topics, requestTopics, loading, onBuyTopics }): ReactElement {
    const queryStringParams = useQueryString();

    useEffect(() => {
        if (!topics || topics.length === 0) {
            requestTopics();
        }
    }, []);

    return (
        <div className="container">
            <TopicsPurchase
                topics={topics}
                chosen={queryStringParams.has('topic') ? [queryStringParams.get('topic')] : []}
                onBuy={onBuyTopics}
            />
            <Loader show={loading} />
        </div>
    );
}

export default connect(
    (state: RootState) => ({
        me: state.users.me,
        loading: state.topics.loading,
        topics: state.topics.list.filter(t => t.status === TopicStatus.unavailable),
    }),
    dispatch => ({
        onBuyTopics: topics => dispatch(subscriptionsActions.buy(topics)),
        requestTopics: () => dispatch(topicsActions.requestList()),
    })
)(Buy)