import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import { requestList } from '../ducks/topics';

function Home({ topics, requestTopics }): ReactElement {
    useEffect(() => {
        if (!topics || topics.length === 0) {
            requestTopics();
        }
    }, [])
    return (
        <h1>Welcome to Binom</h1>
    );
}

export default connect(
    (state: RootState) => ({
        topics: state.topics.list
    }),
    dispatch => ({
        requestTopics: () => dispatch(requestList())
    })
)(Home);