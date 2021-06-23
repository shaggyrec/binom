import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import CreateForm from '../components/CreateForm';
import Loader from '../components/Loader';
import { RootState } from '../Application';
import * as lessonsActions from '../ducks/lessons';
import * as topicsActions from '../ducks/topics';

function LessonCreate({ submitForm, loading, topics, requestTopics }) {
    useEffect(() => {
        if (topics.length === 0) {
            requestTopics();
        }
    }, []);

    return (
        <>
            <div className="w-600 centered">
                <h1>Новый урок</h1>
                <CreateForm
                    categories={topics.map(c => ({ value: c.id, title: c.name }))}
                    onSubmit={submitForm}
                />
            </div>
            <Loader show={loading} />
        </>
    );
}

export default connect(
    (state: RootState) => ({
        loading: state.lessons.loading,
        topics: state.topics.list,
    }),
    dispatch => ({
        submitForm: (name, alias, topic) => dispatch(lessonsActions.create(name, alias, topic)),
        requestTopics: () => dispatch(topicsActions.requestList()),
    })
)(LessonCreate);