import React, { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

import { Topic } from '../dataTypes/topic';
import { Checked, Edit } from './Icons';
import Button from './Button';
import Paddingable from './Paddingable';
import SortableList from './SortableList';

function listContainer (items, onMove, isAdmin) {
    return isAdmin ?  <SortableList onMove={onMove} items={items}/> : <>{items}</>;
}

function Sublist({ items, open, onMove, isAdmin }) {
    return (
        <div className={`sub-list ${open ? 'opened' : 'closed'}`}>
            {
                listContainer(
                    items.map((item, i) => (
                        <div key={`sub-list${item.id}${i}`} className="sub-list-item">
                            <div className="sub-list-item-title">
                                <Link to={`/lesson/${item.alias}`}>
                                    {item.name}
                                </Link>
                            </div>
                        </div>
                    )),
                    (i, at) => onMove(items[i].id, at),
                    isAdmin
                )
            }
        </div>
    );
}
// <div className="list-item-icon"><Checked fill="#039151" /></div>
function TopicsList(
    { topics, isAdmin, onMoveTopic, onMoveLesson }: { topics: Topic[], isAdmin?: boolean, onMoveTopic: (id: string, moveAt: number) => any, onMoveLesson: (id: string, moveAt: number) => any }
): ReactElement {
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

    return listContainer(topics.map(t => (
            <Paddingable key={t.id} padding={[0,0,20]}>
                <div className={`card transition3 ${openTopics.indexOf(t.id) === -1 ? ' pointer' : ''}`}>
                    <div className="flex outline-background" onClick={() => handleClickTopic(t.id)}>
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
                    {t.lessons && t.lessons.length > 0 && <Sublist items={t.lessons} open={openTopics.indexOf(t.id) !== -1} onMove={onMoveLesson} isAdmin={isAdmin}/>}
                </div>
            </Paddingable>
        )),
        (i, at) => onMoveTopic(topics[i].id, at),
        isAdmin
    );
}

export default TopicsList;