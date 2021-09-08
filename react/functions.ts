import axios, { AxiosResponse, Method } from 'axios';
import { authToken } from './tokens';

export const SERVER_REQUESTS_BASE = location.hostname === 'localhost' ? 'http://localhost:4030' : '';

const apiClient = axios.create({
    baseURL: SERVER_REQUESTS_BASE
});

export const currentScript = (): Node => (
    document.currentScript || ((): Node => {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })()
);

export const serverRequest = (url: string, method: Method = 'get', body: any = {}, headers: any = {}): Promise<AxiosResponse> => {
    const token = authToken();
    return apiClient.request({
        url,
        method,
        data: body,
        headers: {
            ...(headers || {}),
            ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
        }
    });
}

export const getApiErrorMessage = (error): string => {
    return error?.response?.data?.message || error.message
}

export const setCookie = (name, value, options: {expires?: number|Date|string, path?: string, 'max-age'?: number } = {}) => {
    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    for (const optionKey in options) {
        updatedCookie += '; ' + optionKey;
        const optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += '=' + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

export function deleteCookie(name) {
    setCookie(name, '', { 'max-age': -1 });
}

export function goToYoomoney(params): void {
    const form = document.createElement('form');
    form.action = 'https://yoomoney.ru/quickpay/confirm.xml';
    form.method = 'POST';

    for (const param in params) {
        const input = document.createElement('input')
        input.name = param
        input.value = params[param]
        form.append(input)
    }
    document.body.append(form)
    form.submit();

}
