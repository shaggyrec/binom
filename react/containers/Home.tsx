import React, { ReactElement } from 'react';
import { connect } from 'react-redux';

function Home(): ReactElement {
    return (
        <h1>Welcome to Binom</h1>
    );
}

export default connect()(Home);