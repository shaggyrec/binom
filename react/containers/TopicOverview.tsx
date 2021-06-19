import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import * as topicsActions from '../ducks/topics';
import Loader from '../components/Loader';

function TopicOverview({ requestTopic, topic, loading, match: { params } }): ReactElement {
    useEffect(() => {
        if (!topic) {
            requestTopic(params.alias);
        }
    }, [])
    if (!topic || loading) {
        return <Loader />;
    }
    return <h1>{topic.name}</h1>;
}

export default connect(
    (state: RootState) => ({
        topic: state.topics.current,
        loading: state.topics.loading,
    }),
    dispatch => ({
        requestTopic: alias => dispatch(topicsActions.request(alias)),
    })
)(TopicOverview);