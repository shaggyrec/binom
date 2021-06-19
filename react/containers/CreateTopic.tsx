import React  from 'react';
import { connect } from 'react-redux';

import CreateTopicForm from '../components/CreateTopicForm';

function CreateTopic () {
    return (
        <div className="w-600 centered">
            <h1>Новая тема</h1>
            <CreateTopicForm onSubmit={(name, alias) => console.log(name, alias)}/>
        </div>
    );
}

export default connect()(CreateTopic);