import React from 'react';
import { ReactElement } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from '../components/Button';

function ControlPanel() {
    return (
        <div className="py-20">
            <Link to="/topic/create">
                <Button>Создать тему</Button>
            </Link>
        </div>
    );
}

export default connect()(ControlPanel)