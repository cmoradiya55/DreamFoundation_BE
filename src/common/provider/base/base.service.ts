import { S3Helper } from '@common/helper/s3.helper';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

@Injectable()
export class BaseService {
  constructor(private readonly dataSource: DataSource) { }

  /**
   * Wraps a unit of work in a transaction.
   * @param logic The business logic to execute. It receives a transactional EntityManager.
   * @param isTransactional A boolean to conditionally run the logic within a transaction.
   * @returns The result of the business logic.
   */
  async catch<T>(
    logic: (transactionalManager: EntityManager) => Promise<T>,
    isTransactional: boolean = false,
  ): Promise<T> {
    if (!isTransactional) {
      return await logic(this.dataSource.manager);
    }

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await logic(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  validateRequiredFilesInFormData(files, requiredFields: string[]) {
    for (const field of requiredFields) {
      if (!files[field] || files[field].length === 0) {
        throw new BadRequestException(`File ${field} is required`);
      }
    }
  }

  /**
   * Validates a single required file in form-data
   */
  validateRequiredFile(file: Express.Multer.File, fieldName = 'file') {
    if (!file || !file.buffer || file.size === 0) {
      throw new BadRequestException(`File '${fieldName}' is required`);
    }
  }

  async processFileField(
    oldKey: string | null,
    newFile: Express.Multer.File | undefined,
    fieldName: string,
    s3Folder: string,
    required = true
  ): Promise<string> {
    // Required check
    if (!oldKey && !newFile && required) {
      throw new BadRequestException(`File '${fieldName}' is required`);
    }

    // If no new file → return old key
    if (!newFile) {
      return oldKey || '';
    }

    // Validate file
    if (required) this.validateRequiredFile(newFile, fieldName);

    // Upload new file
    const newKey = await S3Helper.storeFile(newFile, s3Folder);

    if (!newKey) {
      throw new BadRequestException(`Failed to upload file '${fieldName}'`);
    }

    // Delete old file if replaced
    if (oldKey && oldKey !== newKey) {
      await S3Helper.deleteFile(oldKey);
    }

    return newKey;
  }
}