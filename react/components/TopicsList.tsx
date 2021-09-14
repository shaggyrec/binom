import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Topic } from '../dataTypes/topic';
import { ArrowRight, Checked, Edit, Locked, Processing } from './Icons';
import Button from './Button';
import Paddingable from './Paddingable';
import SortableList from './SortableList';
import { usePrevious } from '../hooks/usePrevious';
import { useScroll } from '../hooks/useScroll';
import TopicListItem from './TopicListItem';
import LessonsList from './LessonsList';
import ListContainer from './ListContainer';

function listContainer (items, onMove, isAdmin) {
    return isAdmin ?  <SortableList onMove={onMove} items={items}/> : <>{items}</>;
}

function TopicsList(
    { topics, isAdmin, onMoveTopic, onMoveLesson }: { topics: Topic[], isAdmin?: boolean, onMoveTopic: (id: string, moveAt: number) => any, onMoveLesson: (id: string, moveAt: number) => any }
): ReactElement {
    const [openTopics, setOpenTopics] = useState(topics.filter(t => t.status && !t.status.finished).map(t => t.id));
    const [scrolled, setScrolled] = useState(false);
    const prevTopics: Topic[] = usePrevious<Topic[]>(topics);
    const [activeTheme, scrollToActiveTheme] = useScroll<HTMLDivElement>({ behavior: 'smooth' });

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

    return (
        <ListContainer
            onMove={(i, at) => onMoveTopic(topics[i].id, at)}
            isAdmin={isAdmin}
        >
            {topics.map((t, index) => (
                <div key={t.id} ref={openTopics[0] === t.id ? activeTheme : null}>
                    <Paddingable padding={[30,0,0]}>
                        <TopicListItem
                            isOpen={openTopics.indexOf(t.id) === -1}
                            topic={t}
                            isPreviousFinished={topics[index-1] ? topics[index-1].status?.finished : true}
                            onClick={() => handleClickTopic(t.id)}
                            isAdmin={isAdmin}
                        >
                            {t.lessons && t.lessons.length > 0 && (
                                <div className={`sub-list ${openTopics.indexOf(t.id) !== -1 ? 'opened' : 'closed'}`}>
                                    <LessonsList
                                        items={t.lessons}
                                        onMove={onMoveLesson}
                                        isAdmin={isAdmin}
                                        active={t.status?.lessonId}
                                        isFinished={t.status?.finished}
                                    />
                                </div>
                            )}
                        </TopicListItem>
                    </Paddingable>
                </div>
            ))}
        </ListContainer>
    );
}

export default TopicsList;