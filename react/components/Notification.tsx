    import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { Notification as NotificationType, NotificationTypes } from '../dataTypes/notification';
import Moment from 'react-moment';

const NOTIFICATION_TITLE = {
    [NotificationTypes.lessonComment]: 'Комметарий к уроку'
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

function Notification({ notification, viewed = false, onClick, isAdmin }: { notification: NotificationType, viewed: boolean, onClick: () => any, isAdmin: boolean }): ReactElement {
    return (
        <Link to={generateLink(notification, isAdmin)} className="no-decoration" onClick={onClick}>
            <div className="neomorphic">
                <div className={`notification${viewed ? '' : ' notification-new'}`}>
                    <div className="notification-header">
                        @{notification.author.username}({notification.author.name}) {NOTIFICATION_TITLE[notification.type]}
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
        </Link>
    );
}
export default Notification;