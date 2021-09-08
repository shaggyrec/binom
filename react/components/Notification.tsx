import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { Notification as NotificationType, NotificationTypes } from '../dataTypes/notification';
import Moment from 'react-moment';

const NOTIFICATION_TITLE = {
    [NotificationTypes.lessonComment]: 'Комментарий к уроку',
    [NotificationTypes.activateSubscription]: 'Подписка оплачена'
}

function generateLink(notification: NotificationType, isAdmin: boolean) {
    if (notification.meta?.link) {
        return notification.meta?.link;
    }

    const linkStart = isAdmin ? `/@${notification.author.username}` : '';
    let linkEnd = '';

    switch (notification.type) {
        case NotificationTypes.lessonComment:
            linkEnd = `/lesson/${notification.meta.lesson}#${notification.meta.comment || ''}`
            break;
        default:
            linkEnd = '';
    }

    return linkStart + linkEnd;
}

function Container({ link, children, onClick }): ReactElement {
    return link
        ? <Link to={link} className="no-decoration" onClick={onClick}>{children}</Link>
        : <div className="a" onClick={onClick}>{children}</div>;
}

function Notification({ notification, viewed = false, onClick, isAdmin }: { notification: NotificationType, viewed: boolean, onClick: () => any, isAdmin: boolean }): ReactElement {
    return (
        <Container link={generateLink(notification, isAdmin)} onClick={onClick}>
            <div className="neomorphic">
                <div className={`notification${viewed ? '' : ' notification-new'}`}>
                    <div className="notification-header">
                        {notification.author ? `@${notification.author.username}(${notification.author.name})` : ''} {NOTIFICATION_TITLE[notification.type]}
                    </div>
                    <div className="notification-row">
                        <div className="notification-status"/>
                        <div className="notification-text">{notification.message}</div>
                        <time className="notification-date">
                            <Moment format="D MMM YYYY HH:mm:ss" locale="ru">{notification.created}</Moment>
                        </time>
                    </div>
                </div>
            </div>
        </Container>
    );
}
export default Notification;