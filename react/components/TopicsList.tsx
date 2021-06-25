import React, { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

import { Topic } from '../dataTypes/topic';
import { Checked, Edit } from './Icons';
import Button from './Button';
import Paddingable from './Paddingable';


function Sublist({ items, open }) {
    return (
        <div className={`sub-list ${open ? 'opened' : 'closed'}`}>
            {items.map((item, i) => (
                <div key={`sub-list${item.id}${i}`} className="sub-list-item">
                    <div className="sub-list-item-title">
                        <Link to={`/lesson/${item.alias}`}>
                            {item.name}
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
// <div className="list-item-icon"><Checked fill="#039151" /></div>
function TopicsList({ topics, isAdmin }: { topics: Topic[], isAdmin?: boolean }): ReactElement[] {
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

    return topics.map(t => (
            <Paddingable key={t.id} padding={[0,0,20]}>
                <div className={`card${openTopics.indexOf(t.id) === -1 ? ' pointer' : ''}`} onClick={() => handleClickTopic(t.id)}>
                    <div className="flex">
                        <div>
                            <div className="card-icon card-icon-paragraph">§</div>
                        </div>
                        <div>
                            <div className="card-title">{t.name}</div>
                            <div className="card-info">
                                {t.lessons && <span>{t.lessons.length} уроков</span>}
                            </div>
                        </div>
                        {isAdmin &&
                            <div style={{ flexGrow: 1, textAlign: 'right' }}>
                                <Link to={`/topic/${t.alias}`}>
                                    <Button small>
                                        <Edit  size={20}/>
                                    </Button>
                               </Link>
                            </div>
                        }
                    </div>
                    {t.lessons && t.lessons.length > 0 && <Sublist items={t.lessons} open={openTopics.indexOf(t.id) !== -1}/>}
                </div>
            </Paddingable>
    ));
}

export default TopicsList;