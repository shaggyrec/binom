import { deleteCookie, setCookie } from './functions';

const ACCESS_TOKEN_STORAGE_NAME = 'binomAccessToken';
const REFRESH_TOKEN_STORAGE_NAME = 'binomRefreshToken';
const ACCESS_TOKEN_EXPIRED_STORAGE_NAME = 'binomAccessTokenExpired';
const ACCESS_TOKEN_COOKIE_NAME = 'access_token';

export function storeTokens(t, rt, tExpired) {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_NAME, t);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_NAME, rt);
    localStorage.setItem(ACCESS_TOKEN_EXPIRED_STORAGE_NAME, tExpired)
    setCookie(ACCESS_TOKEN_COOKIE_NAME, t);
}

export function getTokens(): string[] {
    return [
        localStorage.getItem(ACCESS_TOKEN_STORAGE_NAME),
        localStorage.getItem(REFRESH_TOKEN_STORAGE_NAME),
    ];
}

export function getTokenExpired(): number {
    return +localStorage.getItem(ACCESS_TOKEN_EXPIRED_STORAGE_NAME) * 1000;
}

export function authToken(): string {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_NAME);
}

export function eraseTokens() {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_NAME);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_NAME);
    localStorage.removeItem(ACCESS_TOKEN_EXPIRED_STORAGE_NAME);
    deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
}