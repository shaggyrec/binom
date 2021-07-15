import { User } from './user';


export enum NotificationTypes {
    lessonComment = 1,
    postComment = 2
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