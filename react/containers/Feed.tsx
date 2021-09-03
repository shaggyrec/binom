import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

function Feed(): ReactElement {
    return (
        <div className="container w-600">
            <h1>Сообщество</h1>
            <p>
                Раздел появится совсем скоро. Это будет форум для учащихся, где каждый сможет задать вопрос
                и поделиться успехами или новостями.
            </p>
            <Link to="/app">На страницу обучения</Link>
        </div>
    );
}

export default Feed;