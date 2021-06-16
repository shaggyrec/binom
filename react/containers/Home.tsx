import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';

function Home(): ReactElement {
    useEffect(() => {

    }, [])
    return (
        <h1>Welcome to Binom</h1>
    );
}

export default connect(
    (state: RootState) => ({
        topics: state.topics.list
    })
)(Home);