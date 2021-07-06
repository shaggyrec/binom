import { User } from './user';

export interface LessonComment {
    id: string
    lessonId: string;
    text: string;
    created: Date;
    updated: Date;
    author: User;
    userId: string;
    files: any[];
}