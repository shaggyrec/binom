import React from 'react';
import { ReactElement } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from '../components/Button';
import Paddingable from '../components/Paddingable';

function ControlPanel() {
    return (
        <div className="py-20">
            <Paddingable padding={[10, 0]}>
                <Link to="/topic/create">
                    <Button>Создать тему</Button>
                </Link>
            </Paddingable>
            <Paddingable padding={[10, 0]}>
                <Link to="/lesson/create">
                    <Button>Создать урок</Button>
                </Link>
            </Paddingable>
        </div>
    );
}

export default connect()(ControlPanel)