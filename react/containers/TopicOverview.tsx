import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import * as topicsActions from '../ducks/topics';
import Loader from '../components/Loader';
import TopicEditForm from '../components/TopicEditForm';
import { Back } from '../components/Icons';
import AdminBar from '../components/AdminBar';
import { Link } from 'react-router-dom';

function TopicOverview({ requestTopic, topic, loading, match: { params }, updateTopic, resetTopic }): ReactElement {
    useEffect(() => {
        requestTopic(params.alias);
        return resetTopic();
    }, [])
    if (!topic) {
        return <Loader />;
    }
    function handleSubmit(updated) {
        updateTopic(topic.id, updated)
    }
    return (
        <>
            <AdminBar>
                <Link to="/app">
                    <Back size={25}/>
                </Link>
            </AdminBar>
            <TopicEditForm {...topic} onSubmit={handleSubmit}/>
            <Loader show={loading}/>
        </>
    );
}

export default connect(
    (state: RootState) => ({
        topic: state.topics.current,
        loading: state.topics.loading,
    }),
    dispatch => ({
        requestTopic: alias => dispatch(topicsActions.request(alias)),
        updateTopic: (id, updated) => dispatch(topicsActions.update(id, updated)),
        resetTopic: () => dispatch(topicsActions.topic(null))
    })
)(TopicOverview);