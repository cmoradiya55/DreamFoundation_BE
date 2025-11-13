import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PAGINATION } from '@common/constants';
import { IS_PAGINATED_KEY } from '@common/provider/pagination/decorator/pagination.decorator';
import { PaginationService } from '@common/provider/pagination/pagination.service';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector,
        private readonly paginationService: PaginationService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const dto = this.reflector.get<ClassConstructor<any>>('serializeDto', context.getHandler());
        const isPaginated = this.reflector.get<boolean>(IS_PAGINATED_KEY, context.getHandler());

        if (!dto) {
            return next.handle();
        }
        const options = {
            excludeExtraneousValues: true,
            exposeDefaultValues: true,
        };

        return next.handle().pipe(
            map((response) => {
                const request = context.switchToHttp().getRequest();

                if (
                    isPaginated &&
                    response &&
                    response.data &&
                    Array.isArray(response.data.data) &&
                    response.data.data.length >= 2 &&
                    typeof response.data.data[1] === 'number'
                ) {
                    const [items, total] = response.data.data;
                    const page =
                        parseInt(request.query.page as string, 10) ||
                        PAGINATION.DEFAULT_PAGE;
                    const limit =
                        parseInt(request.query.limit as string, 10) ||
                        PAGINATION.DEFAULT_LIMIT;

                    const serializedData = plainToInstance(dto, items, options);

                    const meta = this.paginationService.createPaginatedResponse(items, total, page, limit,).meta;

                    return {
                        ...response,
                        data: serializedData,
                        meta,
                    };
                }

                if (response && response.data) {
                    return {
                        ...response,
                        data: plainToInstance(dto, response.data, options),
                    };
                }

                return plainToInstance(dto, response, options);
            }),
        );
    }
}
