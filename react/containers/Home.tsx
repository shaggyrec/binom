import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import { requestList } from '../ducks/topics';
import TopicsList from '../components/TopicsList';
import Loader from '../components/Loader';
import Paddingable from '../components/Paddingable';

function Home({ topics, requestTopics }): ReactElement {
    useEffect(() => {
        if (!topics || topics.length === 0) {
            requestTopics();
        }
    }, []);

    return topics
        ? (
            <Paddingable padding={[20, 0]}>
                <TopicsList topics={topics} />
            </Paddingable>
        )
        : <Loader />;
}

export default connect(
    (state: RootState) => ({
        topics: state.topics.list
    }),
    dispatch => ({
        requestTopics: () => dispatch(requestList()),
    })
)(Home);