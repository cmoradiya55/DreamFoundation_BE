import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { PAGINATION } from '@common/constants';
import { PaginationService } from './pagination.service';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  constructor(private readonly paginationService: PaginationService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const page = parseInt(request.query.page as string, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(request.query.limit as string, 10) || PAGINATION.DEFAULT_LIMIT;

    return next.handle().pipe(
      map(([items, total]) => 
        this.paginationService.createPaginatedResponse(items, total, page, limit)
      ),
    );
  }
}