import { SetMetadata } from '@nestjs/common';

export const Serialize = (dto: any) => SetMetadata('serializeDto', dto);
