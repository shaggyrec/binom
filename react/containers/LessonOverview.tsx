import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import * as topicsActions from '../ducks/topics';
import Loader from '../components/Loader';
import TopicEditForm from '../components/TopicEditForm';

function LessonOverview ({ requestTopic, topic, loading, match: { params }, updateTopic }): ReactElement {
    useEffect(() => {
        if (!topic) {
            requestTopic(params.alias);
        }
    }, [])
    if (!topic) {
        return <Loader />;
    }
    function handleSubmit(updated) {
        updateTopic(topic.id, updated)
    }
    return (
        <>
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
    })
)(LessonOverview);