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

function Home({ topics, requestTopics, isAdmin, moveTopicAtPosition, moveLessonAtPosition, loading, currentLesson, subscription, me }): ReactElement {
    useEffect(() => {
        if (!topics || topics.length === 0) {
            requestTopics();
        }
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

    return topics
        ? (
            <>
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
                                <Link to="/tariffs/edit">
                                    <Button small>Управление тарифами</Button>
                                </Link>
                            </Paddingable>
                        </div>
                    </TopBar>
                }
                <div className="container">
                    {!isAdmin && !subscription && (
                        <Paddingable padding={[20, 0, 0]}>
                            <Paddingable padding={[20, 10]} className="badge badge-red">
                                Демо-версия. Доступны только две темы и недоступны домашние задания обратная связь.&nbsp;
                                <Link to={`/@${me.username}#buy`} className="text-white">Оформите подписку, чтобы получить полный доступ.</Link>
                            </Paddingable>
                        </Paddingable>
                    )}
                    <Paddingable padding={[10, 0, 20]}>
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
        currentLesson: state.lessons.current,
        loading: state.topics.loading || state.lessons.loading,
        isAdmin: state.users.me?.role === UserRole.admin,
        me: state.users.me,
        subscription: state.users.me?.subscription,
    }),
    dispatch => ({
        requestTopics: () => dispatch(topicsActions.requestList()),
        moveTopicAtPosition: (id, pos) => dispatch(topicsActions.moveAtPosition(id, pos)),
        moveLessonAtPosition: (id, pos) => dispatch(lessonsActions.moveAtPosition(id, pos))
    })
)(Home);