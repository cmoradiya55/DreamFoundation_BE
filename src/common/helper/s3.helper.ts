import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import * as path from 'path';
import * as crypto from 'crypto';

export class S3Helper {
  private static s3: S3Client;
  private static bucket: string;
  private static baseUrl: string;

  /**
   * Initialize the S3 client (call once on app start, e.g., in main.ts or a bootstrap service)
   */
  static init(config: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    baseUrl: string;
  }) {
    const { region, accessKeyId, secretAccessKey, bucket, baseUrl } = config;

    if (!region || !accessKeyId || !secretAccessKey || !bucket || !baseUrl) {
      throw new Error('Missing AWS S3 configuration.');
    }

    this.bucket = bucket;
    this.baseUrl = baseUrl;

    this.s3 = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  /**
   * Get full public S3 URL for a file
   */
  static getFile(key: string): string | null {
    if (!key) return null;
    return `${this.baseUrl}/${key}`;
  }

  /**
   * Upload file to S3
   */
  static async storeFile(
    file: Express.Multer.File,
    folder = 'others',
  ): Promise<string | null> {
    if (!file || !this.s3 || !this.bucket) return null;

    const timestamp = new Date().toISOString().replace(/\D/g, '');
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}_${crypto.randomUUID()}${ext}`;
    const key = `${folder}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);
    return key;
  }

  /**
   * Delete file from S3
   */
  static async deleteFile(key: string): Promise<boolean> {
    if (!key || !this.s3 || !this.bucket) return false;

    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      return true;
    } catch {
      return false;
    }
  }
}
