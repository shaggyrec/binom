import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import '../css/error.css';

function NotFoundPage(): ReactElement {
    return (
        <div className="container">
            <h1>Страница не найдена</h1>
            <p>
                Перейдите к <Link to="/app">списку тем</Link> или в <Link to="/feed">ленту</Link>
            </p>
            <div className="error-code">
                <div className="error-code-number">4</div>
                <div className="error-code-0"/>
                <div className="error-code-number">4</div>
            </div>
        </div>
    );
}

export default NotFoundPage;