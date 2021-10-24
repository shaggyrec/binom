import { User } from './user';

export interface Post {
    id: string;
    user: User;
    userId: string;
    text: string;
    likesAmount: number;
    created: Date;
    updated: Date;
    images: string[];
    comments: any[]; // TODO: replace with Comment[]
}