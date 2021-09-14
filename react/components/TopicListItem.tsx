import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import Button from './Button';
import Paddingable from './Paddingable';
import { Checked, Edit, Locked, Processing } from './Icons';
import moment from 'moment';
import Moment from 'react-moment';

function renderIcon(topicStatus: { created: Date, finished: Date, lessonId: string }, isPreviousFinished) {
    if (!topicStatus) {
        return isPreviousFinished
            ? <div className="card-icon"><Locked size={25} /></div>
            : <div className="card-icon card-icon-paragraph">§</div>;
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

function renderTopicButtonsBlock(isAdmin, topic, isPreviousFinished) {
    if (isAdmin) {
        return (
            <div style={{ flexGrow: 1, textAlign: 'right' }}>
                <Link to={`/topic/${topic.alias}`}>
                    <Button small>
                        <Edit size={20}/>
                    </Button>
                </Link>
            </div>
        );
    }

    if (topic.status?.finished) {
        return (
            <Paddingable padding={[5,0,0]}>
                <span className="badge">Зачёт</span>
            </Paddingable>
        );
    }

    if (topic.openDate) {
        const openDate = getOpenDate(topic.openDate);
        if (+new Date() < +openDate) {
            return (
                <Paddingable padding={[5,0,0]}>
                    <div className="text text-red">
                        <small>
                            откроется&nbsp;
                            <Moment locale="ru" format="DD MMMM">{openDate}</Moment>
                        </small>
                    </div>
                </Paddingable>
            );
        }
    }

    if (isPreviousFinished && (!topic.status || !topic.status.finished) && topic.lessons?.length > 0) {
        return (
            <div style={{ flexGrow: 1, textAlign: 'right' }}>
                <Link to={`/lesson/${topic?.status ? topic.lessons.find(l => l.id === topic.status.lessonId).alias : topic.lessons[0].alias}`}>
                    <Button green>{topic.status ? 'Продолжить' : 'Начать'}</Button>
                </Link>
            </div>
        );
    }

    return null;
}

function getOpenDate(openDate): Date {
    const currentMonth = new Date().getMonth();
    const monthOfOpenDate = parseInt(openDate.split('-')[1]) - 1
    let date = new Date((new Date()).getFullYear() + '-' + openDate.split('-').reverse().join('-'));
    if (currentMonth < 5 && monthOfOpenDate > 5) {
        date = new Date(moment().subtract(1,'year').toDate().getFullYear() + '-' + openDate.split('-').reverse().join('-'));
    }
    if (currentMonth > 5 && monthOfOpenDate < 5) {
        date = new Date(moment().subtract(-1,'year').toDate().getFullYear() + '-' + openDate.split('-').reverse().join('-'));
    }

    return date;
}

function checkOpenDate(openDate: string): boolean {
    return openDate ? +new Date() < +getOpenDate(openDate) : false;
}

function TopicListItem({ topic, isOpen, isPreviousFinished, onClick, isAdmin, children }): ReactElement {
    const isBlocked = !isAdmin && checkOpenDate(topic.openDate);
    return (
        <div className={`card transition3 ${isOpen ? ' pointer' : ''} ${topicStatusClass(topic.status)}`}>
            <div className="flex flex-vertical-top outline-background gap-10" onClick={onClick}>
                <div>
                    {renderIcon(topic.status, !isPreviousFinished)}
                </div>
                <div>
                    <div className="card-title">{topic.name}</div>
                    <div className="card-info">
                        {topic.lessons && <span>{topic.lessons.length} уроков</span>}
                    </div>
                </div>
                {renderTopicButtonsBlock(isAdmin, topic, isPreviousFinished)}
            </div>
            {isBlocked ? null : children}
        </div>
    );
}

export default TopicListItem;