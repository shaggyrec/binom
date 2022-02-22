import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import * as topicsActions from '../ducks/topics';
import * as lessonsActions from '../ducks/lessons';
import TopicsList from '../components/TopicsList';
import Loader from '../components/Loader';
import Paddingable from '../components/Paddingable';
import { UserRole } from '../dataTypes/user';
import TopBar from '../components/TopBar';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Redirect } from 'react-router';
import DemoUserMessage from '../components/DemoUserMessage';
import * as coursesActions  from '../ducks/courses';

function Home({ topics, isAdmin, moveTopicAtPosition, moveLessonAtPosition, loading, currentLesson, me, isDemo, requestTopics }): ReactElement {
    useEffect(() => {
        requestTopics();
    }, []);

    if (currentLesson) {
        return <Redirect to={`/lesson/${currentLesson.alias}`} />;
    }

    function handleMoveTopic(id: string, moveToIndex: number) {
        moveTopicAtPosition(id, moveToIndex + 1);
    }

    function handleMoveLesson(id: string, moveToIndex: number) {
        moveLessonAtPosition(id, moveToIndex + 1);
    }

    return (<>
        {isAdmin &&
                    <TopBar>
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
                            <Paddingable padding={[0, 10, 0, 0]}>
                                <Link to="/subscriptions/edit">
                                    <Button small>Управление тарифами</Button>
                                </Link>
                            </Paddingable>
                        </div>
                    </TopBar>
        }
        <div className="container">
            <DemoUserMessage user={me}/>
            <Paddingable padding={[10, 0, 20]}>
                {topics && <TopicsList
                    topics={topics}
                    isAdmin={isAdmin}
                    onMoveTopic={handleMoveTopic}
                    onMoveLesson={handleMoveLesson}
                    isDemo={isDemo}
                />}
            </Paddingable>
        </div>
        <Loader show={loading} />
    </>
    );
}

export default connect(
    (state: RootState) => ({
        topics: state.topics.list,
        currentLesson: state.lessons.current,
        loading: state.topics.loading || state.lessons.loading,
        isAdmin: state.users.me?.role === UserRole.admin,
        me: state.users.me,
        subscription: state.users.me?.subscription,
        isDemo: state.users.me?.role !== UserRole.admin && !state.users.me?.subscription
    }),
    dispatch => ({
        requestTopics: () => dispatch(topicsActions.requestList()),
        moveTopicAtPosition: (id, pos) => dispatch(topicsActions.moveAtPosition(id, pos)),
        moveLessonAtPosition: (id, pos) => dispatch(lessonsActions.moveAtPosition(id, pos)),
        requestCourse: id => dispatch(coursesActions.requestCourse(id)),
    })
)(Home);