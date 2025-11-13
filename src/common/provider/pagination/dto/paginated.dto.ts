export class PaginationMeta {
  public readonly current_page: number;
  public readonly per_page: number;
  public readonly last_page: number;
  public readonly total: number;
  public readonly current_page_record: number;

  constructor(total: number, currentPage: number, perPage: number, currentPageRecord: number) {
    this.total = total;
    this.current_page = currentPage;
    this.per_page = perPage;
    this.last_page = Math.ceil(total / perPage);
    this.current_page_record = currentPageRecord;
  }
}

export class Paginated<T extends { length: number }> {
  public readonly data: T;
  public readonly meta: PaginationMeta;

  constructor(data: T, total: number, currentPage: number, perPage: number) {
    this.data = data;
    this.meta = new PaginationMeta(total, currentPage, perPage, data.length);
  }
}