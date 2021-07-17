import React, { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

import { Topic } from '../dataTypes/topic';
import { ArrowRight, Checked, Edit, Locked, Processing } from './Icons';
import Button from './Button';
import Paddingable from './Paddingable';
import SortableList from './SortableList';

function listContainer (items, onMove, isAdmin) {
    return isAdmin ?  <SortableList onMove={onMove} items={items}/> : <>{items}</>;
}

function renderLessonItem(lesson, type) {
    if (type) {
        return (
            <Link className={`topic-lesson-item ${type ? `topic-lesson-item-${type}` : ''}`} to={`/lesson/${lesson.alias}`}>
                <span className="topic-lesson-item-icon">
                    {type === 'passed' ? <Checked size={15} /> : <ArrowRight size={15} />}
                </span>
                {lesson.name}
            </Link>
        );
    }
    return (
        <div className="topic-lesson-item">
            <span className="topic-lesson-item-icon">
                <Locked size={15}/>
            </span>
            {lesson.name}
        </div>
    );
}

function Sublist({ items, open, onMove, isAdmin, active }) {
    let isActive = true;
    return (
        <div className={`sub-list ${open ? 'opened' : 'closed'}`}>
            {
                listContainer(
                    items.map((item, i) => {
                        let itemType;
                        if (isActive) {
                            itemType = active ? 'passed' : 'allowed';
                        }
                        if (active === item.id) {
                            itemType = 'active';
                        }
                        if (active === item.id || (!active && i === 0)) {
                            isActive = false;
                        }
                        return (
                            <div key={`sub-list${item.id}${i}`} className="sub-list-item">
                                <div className="sub-list-item-title">
                                    {renderLessonItem(item, isAdmin ? 'active' : itemType)}
                                </div>
                            </div>
                        );
                    }),
                    (i, at) => onMove(items[i].id, at),
                    isAdmin
                )
            }
        </div>
    );
}

function renderIcon(topicStatus: { created: Date, finished: Date, lessonId: string }) {
    if (!topicStatus) {
        return <div className="card-icon card-icon-paragraph">§</div>;
    }
    return (
        <div className="card-icon">
            {topicStatus.finished
                ? <Checked fill="#039151"/>
                : <Processing fill="#AE1100"/>
            }
        </div>
    );

}

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
                    <div className="flex flex-vertical-top outline-background" onClick={() => handleClickTopic(t.id)}>
                        <div>
                            {renderIcon(t.status)}
                        </div>
                        <div>
                            <div className="card-title">{t.name}</div>
                            <div className="card-info">
                                {t.lessons && <span>{t.lessons.length} уроков</span>}
                            </div>
                        </div>
                        {!isAdmin && !t.status && t.lessons?.length > 0 && (
                            <div style={{ flexGrow: 1, textAlign: 'right' }}>
                                <Link to={`/lesson/${t.lessons[0].alias}`}><Button green>Начать</Button></Link>
                            </div>
                        )}
                        {isAdmin &&
                            <div style={{ flexGrow: 1, textAlign: 'right' }}>
                                <Link to={`/topic/${t.alias}`}>
                                    <Button small>
                                        <Edit size={20}/>
                                    </Button>
                               </Link>
                            </div>
                        }
                    </div>
                    {t.lessons && t.lessons.length > 0 && <Sublist items={t.lessons} open={openTopics.indexOf(t.id) !== -1} onMove={onMoveLesson} isAdmin={isAdmin} active={t.status?.lessonId}/>}
                </div>
            </Paddingable>
        )),
        (i, at) => onMoveTopic(topics[i].id, at),
        isAdmin
    );
}

export default TopicsList;