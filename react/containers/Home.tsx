import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import * as topicsActions from '../ducks/topics';
import * as lessonsActions from '../ducks/lessons';
import TopicsList from '../components/TopicsList';
import Loader from '../components/Loader';
import Paddingable from '../components/Paddingable';
import { UserRole } from '../dataTypes/user';
import { Back } from '../components/Icons';
import AdminBar from '../components/AdminBar';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

function Home({ topics, requestTopics, isAdmin, moveTopicAtPosition, moveLessonAtPosition, loading }): ReactElement {
    useEffect(() => {
        if (!topics || topics.length === 0) {
            requestTopics();
        }
    }, []);

    function handleMoveTopic(id: string, moveToIndex: number) {
        moveTopicAtPosition(id, moveToIndex + 1);
    }

    function handleMoveLesson(id: string, moveToIndex: number) {
        moveLessonAtPosition(id, moveToIndex + 1);
    }

    return topics
        ? (
            <>
                {isAdmin &&
                    <AdminBar>
                        <div className="flex">
                            <Paddingable padding={[0, 10, 0, 0]}>
                                <Link to="/topic/create">
                                    <Button small>Создать тему</Button>
                                </Link>
                            </Paddingable>
                            <Paddingable padding={[0, 10, 0, 0]}>
                                <Link to="/lesson/create">
                                    <Button small>Создать урок</Button>
                                </Link>
                            </Paddingable>
                        </div>
                    </AdminBar>
                }
                <div className="container">
                    <Paddingable padding={[20, 0]}>
                        <TopicsList topics={topics} isAdmin={isAdmin} onMoveTopic={handleMoveTopic} onMoveLesson={handleMoveLesson}/>
                    </Paddingable>
                </div>
                <Loader show={loading} />
            </>
        )
        : <Loader />;
}

export default connect(
    (state: RootState) => ({
        topics: state.topics.list,
        loading: state.topics.loading || state.lessons.loading,
        isAdmin: state.users.me?.role === UserRole.admin
    }),
    dispatch => ({
        requestTopics: () => dispatch(topicsActions.requestList()),
        moveTopicAtPosition: (id, pos) => dispatch(topicsActions.moveAtPosition(id, pos)),
        moveLessonAtPosition: (id, pos) => dispatch(lessonsActions.moveAtPosition(id, pos))
    })
)(Home);