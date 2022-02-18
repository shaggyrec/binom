import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import CreateForm from '../components/CreateForm';
import * as topicActions from '../ducks/topics'
import * as coursesActions from '../ducks/courses'
import { RootState } from '../Application';
import Loader from '../components/Loader';

function TopicCreate ({ submitForm, loading, courses, requestCourses }) {
    useEffect(() => {
        if (courses.length === 0) {
            requestCourses();
        }
    }, [])
    return (
        <>
            <div className="w-600 centered">
                <h1>Новая тема</h1>
                <CreateForm categories={courses.map(c => ({ value: c.id, title: c.name }))} onSubmit={submitForm}/>
            </div>
            <Loader show={loading} />
        </>
    );
}

export default connect(
    (state: RootState) => ({
        loading: state.courses.loading || state.topics.loading,
        courses: state.courses.list || []
    }),
    dispatch => ({
        submitForm: (name, alias, course) => dispatch(topicActions.create(name, alias, course)),
        requestCourses: () => dispatch(coursesActions.request()),
    })
)(TopicCreate);