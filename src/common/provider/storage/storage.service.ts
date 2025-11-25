import { BadRequestException, Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { ALLOWED_CONTENT_TYPES_FLAT, S3_BUCKET_FOLDERS } from '@common/constants';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { UploadFileDto } from './dto/upload-file.dto';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor(private readonly config: ConfigService) {
    this.region = this.config.getOrThrow<string>('aws.region');
    this.bucket = this.config.getOrThrow<string>('aws.bucket');
    const accessKeyId = this.config.getOrThrow<string>('aws.access_key_id');
    const secretAccessKey = this.config.getOrThrow<string>('aws.secret_access_key');


    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async getPresignedUrl(uploadFileDto: UploadFileDto) {
    const { fileName, module, contentType } = uploadFileDto;

    // check content type is allowed
    if (!ALLOWED_CONTENT_TYPES_FLAT.includes(contentType as typeof ALLOWED_CONTENT_TYPES_FLAT[number])) {
      throw new BadRequestException('Content type not allowed');
    }

    // check that in s3 bucket folder exist which is requested
    if (!S3_BUCKET_FOLDERS.includes(module as typeof S3_BUCKET_FOLDERS[number])) {
      throw new BadRequestException('S3 Bucket folder not found');
    }

    // generate timestamp+filename with folder name
    const timestamp = new Date().toISOString().replace(/\D/g, '');
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${module}/${timestamp}_${sanitizedFileName}`;

    const bucket = this.config.getOrThrow<string>('aws.bucket');

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const expiresIn = this.config.getOrThrow<number>('aws.presigned_url_expiration');
    const url = await getSignedUrl(this.s3, command, { expiresIn: expiresIn });

    return {
      upload_url: url,
      file_url: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`,
    };
  }
}