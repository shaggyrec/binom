import React from 'react';
import { connect } from 'react-redux';

function CreateTopic () {
    return <h1>Create topic</h1>;
}

export default connect()(CreateTopic);