import { User } from './user';


export enum NotificationTypes {
    info = 1,
    lessonComment = 2,
    postComment = 3,
    activateSubscription = 5
}


export interface Notification {
    id: string;
    message: string;
    type: number;
    created: Date;
    meta: { post: string, lesson: string, link: string, comment: string };
    author: User;
}

export interface UserNotification {
    id: string;
    notification: Notification;
    viewed: boolean;
}