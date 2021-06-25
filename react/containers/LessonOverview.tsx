import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import { Link } from 'react-router-dom';
import * as lessonsActions from '../ducks/lessons';
import Loader from '../components/Loader';
import Lesson from '../components/Lesson';
import Button from '../components/Button';
import { Edit } from '../components/Icons';
import AdminBar from '../components/AdminBar';
import { UserRole } from '../dataTypes/user';

function LessonOverview ({ requestLesson, lesson, loading, match: { params }, me }): ReactElement {
    useEffect(() => {
        requestLesson(params.alias);
    }, [])

    if (!lesson || lesson.alias !== params.alias) {
        return <Loader />;
    }

    return (
        <>
            {me.role === UserRole.admin &&
                <AdminBar>
                    <Link to={`/lesson/${params.alias}/edit`}>
                        <Button small><Edit size={15}/></Button>
                    </Link>
                </AdminBar>
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
    })
)(LessonOverview);