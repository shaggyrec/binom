import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import { requestList } from '../ducks/topics';
import TopicsList from '../components/TopicsList';
import Loader from '../components/Loader';
import Paddingable from '../components/Paddingable';
import { UserRole } from '../dataTypes/user';

function Home({ topics, requestTopics, isAdmin }): ReactElement {
    useEffect(() => {
        if (!topics || topics.length === 0) {
            requestTopics();
        }
    }, []);

    return topics
        ? (
            <div className="container">
                <Paddingable padding={[20, 0]}>
                    <TopicsList topics={topics} isAdmin={isAdmin}/>
                </Paddingable>
            </div>
        )
        : <Loader />;
}

export default connect(
    (state: RootState) => ({
        topics: state.topics.list,
        isAdmin: state.users.me?.role === UserRole.admin
    }),
    dispatch => ({
        requestTopics: () => dispatch(requestList()),
    })
)(Home);