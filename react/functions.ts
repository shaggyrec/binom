import axios, { AxiosResponse, Method } from 'axios';
import { authToken } from './tokens';

const apiClient = axios.create({
    baseURL: location.hostname === 'localhost' ? 'http://localhost:4030' : ''
});

export const currentScript = (): Node => (
    document.currentScript || ((): Node => {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })()
);

export const serverRequest = (url: string, method: Method = 'get', body: any = {}, options: any = {}): Promise<AxiosResponse> => {
    const token = authToken();
    return apiClient.request({
        url,
        method,
        data: body,
        headers: {
            ...(options.headers || {}),
            ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
        },
        ...options
    });
}