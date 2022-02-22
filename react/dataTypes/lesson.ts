import { User } from './user';

export interface Lesson {
    id: string
    name: string;
    text: string;
    task: string;
    taskFiles: string[];
    video: string[];
    youtubeVideos: string[];
    topicId: string;
    alias: string;
    taskValue: number;
    user?: User;
    progress: LessonStatus
}

export interface LessonStatus {
    created: Date;
    finished: Date;
}