import { deleteCookie, setCookie } from './functions';

const ACCESS_TOKEN_STORAGE_NAME = 'binomAccessToken';
const REFRESH_TOKEN_STORAGE_NAME = 'binomRefreshToken';
const ACCESS_TOKEN_COOKIE_NAME = 'access_token';

export function storeTokens(t, rt) {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_NAME, t);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_NAME, rt);
    setCookie(ACCESS_TOKEN_COOKIE_NAME, t);
}

export function getTokens(): string[] {
    return [
        localStorage.getItem(ACCESS_TOKEN_STORAGE_NAME),
        localStorage.getItem(REFRESH_TOKEN_STORAGE_NAME),
    ];
}

export function authToken(): string {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_NAME);
}

export function eraseTokens() {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_NAME);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_NAME);
    deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
}