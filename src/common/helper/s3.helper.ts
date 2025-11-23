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
      // Optional: Add metadata
      Metadata: {
        originalName: file.originalname,
        uploadDate: new Date().toISOString(),
      },
    });

    await this.s3.send(command);
    return key;
  }


  /**
   * Store PDF buffer to S3 (for generated PDFs from Puppeteer)
   */
  static async storePdfBuffer(
    buffer: Buffer,
    fileName: string,
    folder: string,
  ): Promise<{ key: string; url: string }> {
    if (!buffer || !this.s3 || !this.bucket) {
      throw new Error('Missing buffer, S3 client, or bucket configuration');
    }

    try {
      const timestamp = new Date().toISOString().replace(/\D/g, '');
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const key = `${folder}/${timestamp}_${sanitizedFileName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: 'application/pdf',
        Metadata: {
          originalName: fileName,
          uploadDate: new Date().toISOString(),
          type: 'generated-pdf',
        },
      });

      await this.s3.send(command);

      const region = process.env.AWS_REGION || 'us-east-1';
      const url = `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;

      return { key, url };
    } catch (error) {
      console.error('Failed to store PDF to S3:', error);
      throw error;
    }
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
