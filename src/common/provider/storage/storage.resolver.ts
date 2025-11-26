import { Resolver, Query, Args } from '@nestjs/graphql';
import { StorageService } from './storage.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { PresignedUrlResponse } from './model/pre-signed-url-response.model';

@Resolver()
export class StorageResolver {
  constructor(private readonly storageService: StorageService) { }

  @Query(() => PresignedUrlResponse, { name: 'presignedUrl' })
  async getPresignedUrl(
    @Args('uploadFile') uploadFileDto: UploadFileDto,
  ) {
    const data = await this.storageService.getPresignedUrlForImage(uploadFileDto);
    return data;
  }
}
