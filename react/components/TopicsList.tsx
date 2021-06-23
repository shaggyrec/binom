import React, { ReactElement, useState } from 'react';
import { Topic } from '../dataTypes/topic';
import { Checked } from './Icons';


function Sublist({ items }) {
    return (
        <div className="sub-list">
            {items.map((item, i) => (
                <div key={`sub-list${item.id}${i}`} className="sub-list-item">
                    <div className="sub-list-item-title">{item.name}</div>
                </div>
            ))}
        </div>
    );
}
// <div className="list-item-icon"><Checked fill="#039151" /></div>
function TopicsList({ topics }: { topics: Topic[] }): ReactElement {
    const [openTopics, setOpenTopics] = useState([]);

    function handleClickTopic(id) {
        if (openTopics.indexOf(id) === -1) {
            setOpenTopics([...openTopics, id]);
        } else {
            setOpenTopics([
                ...openTopics.slice(0, openTopics.indexOf(id)),
                ...openTopics.slice(openTopics.indexOf(id) + 1),
            ])
        }
    }

    return (
        <div className="list">
            {topics.map(t => (
                <div key={t.id} className={'list-item' + (openTopics.indexOf(t.id) !== -1 ? ' open ' : '')}>
                    <div className="list-item-row" onClick={() => handleClickTopic(t.id)}>
                        <div>
                            <div className="list-item-icon list-item-icon-paragraph">§</div>
                        </div>
                        <div>
                            <div className="list-item-title">{t.name}</div>
                            <div className="list-item-info"><span>5 уроков</span></div>
                        </div>
                    </div>
                    {t.lessons && t.lessons.length > 0 && <Sublist items={t.lessons}/>}
                </div>
            ))}
        </div>
    );
}

export default TopicsList;