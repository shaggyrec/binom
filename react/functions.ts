import axios, { AxiosResponse, Method } from 'axios';
import { authToken } from './tokens';
import { put } from '@redux-saga/core/effects';
import * as applicationActions from './ducks/application';
import * as lessonsActions from './ducks/lessons';

const apiClient = axios.create({
    baseURL: location.hostname === 'localhost' ? 'http://localhost:4030' : ''
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
    return error.response?.data?.message || error.message
}