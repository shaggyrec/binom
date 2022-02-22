import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import * as topicsActions from '../ducks/topics';
import Loader from '../components/Loader';
import TopicEditForm from '../components/TopicEditForm';
import { Back, Bin } from '../components/Icons';
import TopBar from '../components/TopBar';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import * as coursesActions from '../ducks/courses';

function TopicOverview({ requestTopic, topic, loading, match: { params }, updateTopic, resetTopic, removeTopic, courses, requestCourses }): ReactElement {
    useEffect(() => {
        if (courses.length === 0) {
            requestCourses()
        }
        requestTopic(params.alias);
        return resetTopic();
    }, [])
    if (!topic) {
        return <Loader />;
    }
    function handleSubmit(updated) {
        updateTopic(topic.id, updated)
    }
    function handleClickDelete() {
        if (confirm(`Точно удалить тему "${topic.name}"?`)) {
            removeTopic(topic.id);
        }
    }
    return (
        <>
            <TopBar>
                <Link to="/app">
                    <Back size={25}/>
                </Link>
                <div className="ml-auto">
                    <Button red onClick={handleClickDelete}><Bin size={13} fill="#fff"/> Удалить</Button>
                </div>
            </TopBar>
            <div className="container w-600">
                <TopicEditForm {...topic} courses={courses} onSubmit={handleSubmit}/>
            </div>
            <Loader show={loading}/>
        </>
    );
}

export default connect(
    (state: RootState) => ({
        topic: state.topics.current,
        loading: state.topics.loading,
        courses: state.courses.list?.map(c => ({ value: c.id, title: c.name })) || []
    }),
    dispatch => ({
        requestTopic: alias => dispatch(topicsActions.request(alias)),
        updateTopic: (id, updated) => dispatch(topicsActions.update(id, updated)),
        resetTopic: () => dispatch(topicsActions.topic(null)),
        removeTopic: id => dispatch(topicsActions.remove(id)),
        requestCourses: () => dispatch(coursesActions.request()),
    })
)(TopicOverview);