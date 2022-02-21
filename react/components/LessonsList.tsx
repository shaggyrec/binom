import ListContainer from './ListContainer';
import React from 'react';
import { ArrowRight, Checked, Locked } from './Icons';
import { Link } from 'react-router-dom';


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

function LessonsList ({ items, onMove, isAdmin, isAllowed }) {
    return (
        <ListContainer
            onMove={(i, at) => onMove(items[i].id, at)}
            isAdmin={isAdmin}
        >
            {items.map((item, i) => {
                let itemType;
                if (isAllowed) {
                    itemType = 'allowed';
                    if (item.progress && item.progress.created && !item.progress.finished) {
                        itemType = 'active';
                    }
                    if (item.progress && item.progress.finished) {
                        itemType = 'passed';
                    }
                }
                return (
                    <div key={`sub-list${item.id}${i}`} className="sub-list-item">
                        <div className="sub-list-item-title">
                            {renderLessonItem(item, isAdmin ? 'active' : itemType)}
                        </div>
                    </div>
                );
            })}
        </ListContainer>
    );
}

export default LessonsList;