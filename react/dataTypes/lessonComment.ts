import { User } from './user';
import { LessonCommentFile } from './lessonCommentFile';

export interface LessonComment {
    id: string
    lessonId: string;
    text: string;
    created: Date;
    updated: Date;
    author: User;
    userId: string;
    files: LessonCommentFile[];
}