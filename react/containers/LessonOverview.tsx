import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { history, RootState } from '../Application';
import { Link } from 'react-router-dom';
import * as uuid from 'uuid';
import * as lessonsActions from '../ducks/lessons';
import * as lessonCommentsActions from '../ducks/lessonComments';
import * as applicationActions from '../ducks/application';
import * as usersActions from '../ducks/users';
import * as learningProgressActions from '../ducks/learningProgress';
import Loader from '../components/Loader';
import Lesson from '../components/Lesson';
import Button from '../components/Button';
import { Edit } from '../components/Icons';
import TopBar from '../components/TopBar';
import { UserRole } from '../dataTypes/user';
import { BackLink } from '../dataTypes/backLink';
import LessonComments from '../components/LessonsComments';

function LessonOverview ({ requestLesson, lesson, loading, match: { params, url }, me, resetCurrentLesson, setBackLink,
                             requestComments, comments, addComment, requestUser, user, isAdmin, isLessonPassed, requestLessonPassedInfo,
                             toggleLessonPassed
                        }): ReactElement {
    useEffect(() => {
        requestLesson(params.alias);
        if (params.username) {
            requestUser(params.username);
        }
        setBackLink({ url: '/app', onClick: resetCurrentLesson });
    }, []);

    useEffect(() => {
        if (uuid.validate(params.alias) && lesson?.id === params.alias) {
            history.push(url.replace(params.alias, lesson.alias));
            return;
        }
        if (lesson?.alias === params.alias) {
            if (params.username) {
                if (user?.username === params.username) {
                    requestLessonPassedInfo(lesson.alias, user.id)
                    requestComments(lesson.id, user.id);
                }
            } else  {
                requestComments(lesson.id, me.id);
            }
        }
    }, [lesson, user, params.alias]);

    if (!lesson || lesson.alias !== params.alias) {
        return <Loader />;
    }

    function handleLeaveComment(text, files) {
        addComment(lesson.id, (user?.id || me.id), text, files);
    }

    return (
        <>
            {isAdmin &&
                <TopBar>
                    <Link to={`/lesson/${params.alias}/edit`}>
                        <Button small><Edit size={15}/></Button>
                    </Link>
                </TopBar>
            }
            <Lesson {...lesson} name={lesson.name + (params.username ? ` (${params.username})` : '')}/>
            <div className="container">
                <LessonComments comments={comments} onLeaveComment={handleLeaveComment} />
                <div>
                    {isAdmin && params.username && (
                        <Button green onClick={() => toggleLessonPassed(lesson.alias, user.id, !isLessonPassed)}>
                            {isLessonPassed
                                ? 'Отменить зачёт'
                                : 'Зачесть урок'
                            }
                        </Button>
                    )}
                </div>
            </div>
            <Loader show={loading}/>
        </>
    );
}

export default connect(
    (state: RootState) => ({
        lesson: state.lessons.current,
        loading: state.lessons.loading,
        me: state.users.me,
        comments: state.lessonComments.list,
        commentsError: state.lessonComments.error,
        user: state.users.current,
        isAdmin: state.users.me.role === UserRole.admin,
        isLessonPassed: state.learningProgress.list[state.users.current?.id] && state.learningProgress.list[state.users.current?.id][state.lessons.current?.alias]
    }),
    dispatch => ({
        requestLesson: alias => dispatch(lessonsActions.request(alias)),
        resetCurrentLesson: () => dispatch(lessonsActions.lesson(null)),
        setBackLink: (backLink: BackLink) => dispatch(applicationActions.backLink(backLink)),
        requestComments: (id, userId) => dispatch(lessonCommentsActions.requestList(id, userId)),
        addComment: (lessonId, userId, text, files) => dispatch(lessonCommentsActions.add(lessonId, userId, text, files)),
        requestUser: alias => dispatch(usersActions.requestUser(alias)),
        requestLessonPassedInfo: (lessonAlias, userId) => dispatch(learningProgressActions.requestProgressForLesson(lessonAlias, userId)),
        toggleLessonPassed: (lessonAlias, userId, passed) => dispatch(learningProgressActions.save(lessonAlias, userId, passed)),
        resetLesson: () => dispatch(lessonsActions.lesson(null)),
    })
)(LessonOverview);