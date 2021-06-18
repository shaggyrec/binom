export enum UserRole {
    user = 1,
    admin = 2,
}

export interface User {
    id: string;
    email: string;
    name?: string;
    username?: string;
    role: UserRole
}