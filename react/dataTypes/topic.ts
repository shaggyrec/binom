import { Lesson } from './lesson';

export interface Topic {
    id: string;
    alias: string;
    name: string;
    lessons?: Lesson[];
    status?: {
        created: Date,
        finished: Date,
        lessonId: string
    }
}