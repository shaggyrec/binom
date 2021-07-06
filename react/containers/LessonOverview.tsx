import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import { Link } from 'react-router-dom';
import * as lessonsActions from '../ducks/lessons';
import * as lessonCommentsActions from '../ducks/lessonComments';
import * as applicationActions from '../ducks/application';
import Loader from '../components/Loader';
import Lesson from '../components/Lesson';
import Button from '../components/Button';
import { Edit } from '../components/Icons';
import TopBar from '../components/TopBar';
import { UserRole } from '../dataTypes/user';
import { BackLink } from '../dataTypes/backLink';
import LessonComments from '../components/LessonsComments';

function LessonOverview ({ requestLesson, lesson, loading, match: { params }, me, resetCurrentLesson, setBackLink,
                             requestComments, comments, addComment }): ReactElement {
    useEffect(() => {
        requestLesson(params.alias);
        setBackLink({ url: '/app', onClick: resetCurrentLesson });
    }, []);

    useEffect(() => {
        if (lesson?.alias === params.alias) {
            requestComments(lesson.id, params.userId || me.id);
        }
    }, [lesson])

    if (!lesson || lesson.alias !== params.alias) {
        return <Loader />;
    }

    function handleLeaveComment(text, files) {
        addComment(lesson.id, (params.userId || me.id), text, files);
    }

    return (
        <>
            {me.role === UserRole.admin &&
                <TopBar>
                    <Link to={`/lesson/${params.alias}/edit`}>
                        <Button small><Edit size={15}/></Button>
                    </Link>
                </TopBar>
            }
            <Lesson {...lesson} />
            <div className="container">
                <LessonComments comments={comments} onLeaveComment={handleLeaveComment} />
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
    }),
    dispatch => ({
        requestLesson: alias => dispatch(lessonsActions.request(alias)),
        resetCurrentLesson: () => dispatch(lessonsActions.lesson(null)),
        setBackLink: (backLink: BackLink) => dispatch(applicationActions.backLink(backLink)),
        requestComments: (id, userId) => dispatch(lessonCommentsActions.requestList(id, userId)),
        addComment: (lessonId, userId, text, files) => dispatch(lessonCommentsActions.add(lessonId, userId, text, files)),
    })
)(LessonOverview);