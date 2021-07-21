import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Topic } from '../dataTypes/topic';
import { ArrowRight, Checked, Edit, Locked, Processing } from './Icons';
import Button from './Button';
import Paddingable from './Paddingable';
import SortableList from './SortableList';
import { usePrevious } from '../hooks/usePrevious';
import { useScroll } from '../hooks/useScroll';

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

function Sublist({ items, open, onMove, isAdmin, active, isFinished }) {
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
                        if (isFinished) {
                            itemType = 'passed';
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

function topicStatusClass(topicStatus: { created: Date, finished: Date }): string {
    if (!topicStatus) {
        return '';
    }
    return topicStatus.finished ? 'finished' : 'in-progress'
}

function TopicsList(
    { topics, isAdmin, onMoveTopic, onMoveLesson }: { topics: Topic[], isAdmin?: boolean, onMoveTopic: (id: string, moveAt: number) => any, onMoveLesson: (id: string, moveAt: number) => any }
): ReactElement {
    const [openTopics, setOpenTopics] = useState(topics.filter(t => t.status && !t.status.finished).map(t => t.id));
    const [scrolled, setScrolled] = useState(false);
    const prevTopics: Topic[] = usePrevious<Topic[]>(topics);
    const [activeTheme, scrollToActiveTheme] = useScroll();

    useEffect(() => {
        if (scrolled === false && openTopics.length > 0) {
            setScrolled(true);
            scrollToActiveTheme();
        }
    }, [openTopics])

    useEffect(() => {
        if (topics.length > 0 && prevTopics && prevTopics.length === 0) {
            setOpenTopics(topics.filter(t => t.status && !t.status.finished).map(t => t.id))
        }
    }, [topics])

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
            <div key={t.id} ref={openTopics[0] === t.id ? activeTheme : null}>
                <Paddingable padding={[30,0,0]}>
                    <div className={`card transition3 ${openTopics.indexOf(t.id) === -1 ? ' pointer' : ''} ${topicStatusClass(t.status)}`}>
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
                            {!isAdmin && (!t.status || !t.status.finished) && t.lessons?.length > 0 && (
                                <div style={{ flexGrow: 1, textAlign: 'right' }}>
                                    <Link to={`/lesson/${t?.status ? t.lessons.find(l => l.id === t.status.lessonId).alias : t.lessons[0].alias}`}>
                                        <Button green>{t.status ? 'Продолжить' : 'Начать'}</Button>
                                    </Link>
                                </div>
                            )}
                            {t.status?.finished && (
                                <Paddingable padding={[5,0,0,10]}>
                                    <span className="badge">Зачёт</span>
                                </Paddingable>
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
                        {t.lessons && t.lessons.length > 0 && (
                            <Sublist
                                items={t.lessons}
                                open={openTopics.indexOf(t.id) !== -1}
                                onMove={onMoveLesson}
                                isAdmin={isAdmin}
                                active={t.status?.lessonId}
                                isFinished={t.status?.finished}
                            />)}
                    </div>
                </Paddingable>
            </div>
        )),
        (i, at) => onMoveTopic(topics[i].id, at),
        isAdmin
    );
}

export default TopicsList;