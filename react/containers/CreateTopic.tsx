import React  from 'react';
import { connect } from 'react-redux';

import CreateTopicForm from '../components/CreateTopicForm';
import * as topicActions from '../ducks/topics'
import { RootState } from '../Application';
import Loader from '../components/Loader';

function CreateTopic ({ submitForm, loading }) {
    return (
        <>
            <div className="w-600 centered">
                <h1>Новая тема</h1>
                <CreateTopicForm onSubmit={submitForm}/>
            </div>
            <Loader show={loading} />
        </>
    );
}

export default connect(
    (state: RootState) => ({
        loading: state.topics.loading
    }),
    dispatch => ({
        submitForm: (name, alias) => dispatch(topicActions.create(name, alias))
    })
)(CreateTopic);