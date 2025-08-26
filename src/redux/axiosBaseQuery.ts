// src/redux/axiosBaseQuery.js
import axiosInstance from '@/lib/axios';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import {  AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';


const axiosBaseQuery = ({ baseUrl } = { baseUrl: '' }): BaseQueryFn<
    {
        url: string;
        method: AxiosRequestConfig['method'];
        data?: AxiosRequestConfig['data'];
        params?: AxiosRequestConfig['params'];
        headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
> => async ({ url, method, data, params, headers }) => {
    try {
        const result = await axiosInstance({
            url: baseUrl + url,
            method,
            data,
            params,
            headers,
        });
        return { data: result.data };
    } catch (axiosError) {
        let err = axiosError as AxiosError;
        console.error('Full axios error:',err.response?.data)
        return {
            error: {
                status: err.response?.status,
                // data: err.response?.data || err.message,
                data: err.response?.data
            },
        };
    }
};

export default axiosBaseQuery;