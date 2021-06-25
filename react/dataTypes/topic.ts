import { Lesson } from './lesson';

export interface Topic {
    id: string;
    alias: string;
    name: string;
    lessons?: Lesson[];
}