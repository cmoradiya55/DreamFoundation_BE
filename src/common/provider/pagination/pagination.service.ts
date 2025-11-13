import { Injectable } from '@nestjs/common';
import { Paginated } from './dto/paginated.dto';

@Injectable()
export class PaginationService {
  public createPaginatedResponse<T extends { length: number }>(
    items: T,
    total: number,
    page: number,
    limit: number,
  ): Paginated<T> {
    return new Paginated(items, total, page, limit);
  }
}