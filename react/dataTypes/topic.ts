import { Lesson } from './lesson';

export enum TopicStatus {
    'started' = 'started',
    'finished' = 'finished',
    'available' = 'available',
    'unavailable' = 'unavailable',
}

export interface Topic {
    id: string;
    alias: string;
    name: string;
    lessons?: Lesson[];
    status?: TopicStatus
}