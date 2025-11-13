import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer'; // Import Transform
import { PAGINATION } from '@common/constants';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  public page: number = PAGINATION.DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Math.min(value, PAGINATION.MAXIMUM_LIMIT)) // Apply the cap here
  public limit: number = PAGINATION.DEFAULT_LIMIT;
}