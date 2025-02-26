import { Response } from 'express';
import { HTTP_STATUS, ERROR_MESSAGES } from './constants';

export interface ResponsePayload {
    message: string;
    data?: any;
}

export interface ErrorResponse {
    error: any;
}

export const handleResponse = (
    res: Response,
    status: number,
    message: string,
    data?: any,
): Response<ResponsePayload> => {
    const response: ResponsePayload = { message, ...(data && { data }) };
    return res.status(status).json(response);
};

export const handleError = (
    res: Response,
    error: any,
): Response<ErrorResponse> => {
    console.error('Request Error:', error);
    const status = error.statusCode || HTTP_STATUS.BAD_REQUEST;
    const message = error.message || ERROR_MESSAGES.DEFAULT;
    return res.status(status).json({ error: message });
};

export const validateRequestParams = (
    params: Record<string, any>,
    requiredFields: string[],
): void => {
    const missingFields = requiredFields.filter((field) => {
        const value = params[field];
        return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
        throw new Error(
            `${ERROR_MESSAGES.MISSING_FIELDS}: ${missingFields.join(', ')}`,
        );
    }
};
