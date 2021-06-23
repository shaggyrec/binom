import { Lesson } from './Lesson';

export interface Topic {
    id: string;
    alias: string;
    name: string;
    lessons?: Lesson[];
}