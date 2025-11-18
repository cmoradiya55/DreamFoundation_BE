import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

export interface ApiResponse<T> {
    statusCode?: number;
    data?: T;
    message: string;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // GraphQL context handling
        const ctxType = context.getType() as string;
        if (ctxType === 'graphql') {
            return next.handle();
        }

        console.log('ResponseInterceptor invoked');

        // HTTP context handling
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();

        return next.handle().pipe(
            map((res: ApiResponse<any>) => {
                const baseResponse: any = {
                    statusCode: res.statusCode ?? response.statusCode ?? 200,
                    message: res.message,
                };

                if (res.data !== undefined && res.data !== null) {
                    baseResponse.data = res.data;
                }

                return baseResponse;
            }),
        )
    }
}