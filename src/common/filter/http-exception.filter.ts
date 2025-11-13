// src/common/filters/all-exceptions.filter.ts

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

interface IErrorResponse {
    statusCode: number;
    message: string;
    errorCode?: string;
    errors?: string | string[] | Record<string, any>;
    path: string;
    timestamp: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        @Inject('WINSTON_MODULE_NEST_PROVIDER') private readonly logger: LoggerService,
    ) { }

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse();

        const isHttpException = exception instanceof HttpException;

        const httpStatus = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const path = httpAdapter.getRequestUrl(request);
        const timestamp = new Date().toISOString();

        let responseBody: IErrorResponse;
        let logMessage: string;

        if (isHttpException) {
            const exceptionResponse = exception.getResponse();
            logMessage = exception.message;

            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const errorObj = exceptionResponse as { message: string | string[]; error?: string; errors?: any };
                const message = Array.isArray(errorObj.message) ? errorObj.message.join(', ') : errorObj.message;

                responseBody = {
                    statusCode: httpStatus,
                    message: message,
                    errorCode: errorObj.error || 'UNSPECIFIED',
                    errors: errorObj.errors || (Array.isArray(errorObj.message) ? errorObj.message : undefined),
                    path,
                    timestamp,
                };
            } else {
                responseBody = {
                    statusCode: httpStatus,
                    message: exceptionResponse as string,
                    path,
                    timestamp,
                };
            }
        } else {
            logMessage = 'An unexpected internal server error occurred.';
            responseBody = {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal Server Error',
                errorCode: 'INTERNAL_ERROR',
                path,
                timestamp,
            };
        }

        this.logger.error(
            logMessage,
            {
                timestamp,
                path,
                request: {
                    method: request.method,
                    url: request.url,
                    headers: request.headers,
                    body: request.body,
                    errors: responseBody?.errors,
                },
                exception: {
                    name: exception instanceof Error ? exception.name : 'UnknownException',
                    message: exception instanceof Error ? exception.message : String(exception),
                    stack: exception instanceof Error ? exception.stack : undefined,
                },
            }
        );

        if (process.env.NODE_ENV === 'development') {
            responseBody['stack'] = exception instanceof Error ? exception.stack : undefined;
        }

        httpAdapter.reply(response, responseBody, httpStatus);
    }
}