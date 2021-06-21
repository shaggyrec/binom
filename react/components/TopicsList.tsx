import React, { ReactElement } from 'react';
import { Topic } from '../dataTypes/topic';

function TopicsList({ topics }: { topics: Topic[] }): ReactElement {
    return (
        <div className="list">
            {topics.map(t => (
                <div className="list-item">
                    <div className="list-item-row">
                        <div>
                            <div className="list-item-icon">§</div>
                        </div>
                        <div>
                            <div className="list-item-title">{t.name}</div>
                            <div className="list-item-info"><span>5 уроков</span></div>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    );
}

export default TopicsList;