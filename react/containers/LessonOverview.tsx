import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import { Link } from 'react-router-dom';
import * as lessonsActions from '../ducks/lessons';
import * as applicationActions from '../ducks/application';
import Loader from '../components/Loader';
import Lesson from '../components/Lesson';
import Button from '../components/Button';
import { Edit } from '../components/Icons';
import TopBar from '../components/TopBar';
import { UserRole } from '../dataTypes/user';
import { BackLink } from '../dataTypes/backLink';

function LessonOverview ({ requestLesson, lesson, loading, match: { params }, me, resetCurrentLesson, setBackLink }): ReactElement {
    useEffect(() => {
        requestLesson(params.alias);
        setBackLink({ url: '/app', onClick: resetCurrentLesson });
    }, [])

    if (!lesson || lesson.alias !== params.alias) {
        return <Loader />;
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
            <Loader show={loading}/>
        </>
    );
}

export default connect(
    (state: RootState) => ({
        lesson: state.lessons.current,
        loading: state.lessons.loading,
        me: state.users.me
    }),
    dispatch => ({
        requestLesson: alias => dispatch(lessonsActions.request(alias)),
        resetCurrentLesson: () => dispatch(lessonsActions.lesson(null)),
        setBackLink: (backLink: BackLink) => dispatch(applicationActions.backLink(backLink)),
    })
)(LessonOverview);