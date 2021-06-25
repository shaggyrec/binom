import { connect } from 'react-redux';
import { RootState } from '../Application';
import * as lessonsActions from '../ducks/lessons';
import * as topicsActions from '../ducks/topics';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import LessonEditForm from '../components/LessonEditForm';
import { Back, Edit, Save } from '../components/Icons';
import AdminBar from '../components/AdminBar';

function LessonEdit({ requestLesson, lesson, loading, match: { params }, updateLesson, requestTopics, topics }) {
    useEffect(() => {
        if (!lesson) {
            requestLesson(params.alias);
        }
        if (topics.length === 0) {
            requestTopics();
        }
    }, [])
    if (!lesson) {
        return <Loader />;
    }
    function handleSubmit(updated) {
        updateLesson(lesson.id, updated)
    }
    return (
        <>
            <AdminBar>
                <Link to={`/lesson/${params.alias}`}>
                    <Back size={25}/>
                </Link>
            </AdminBar>
            <div className="w-600 centered">
                <LessonEditForm {...lesson} topics={topics} onSubmit={handleSubmit}/>
            </div>
            <Loader show={loading}/>
        </>
    );
}
export default connect(
    (state: RootState) => ({
        lesson: state.lessons.current,
        topics: state.topics.list.map(c => ({ value: c.id, title: c.name })),
        loading: state.lessons.loading,
    }),
    dispatch => ({
        requestLesson: alias => dispatch(lessonsActions.request(alias)),
        requestTopics: () => dispatch(topicsActions.requestList()),
        updateLesson: (id, updated) => dispatch(lessonsActions.update(id, updated)),
    })
)(LessonEdit)