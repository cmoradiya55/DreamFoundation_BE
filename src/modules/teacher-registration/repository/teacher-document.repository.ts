import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherDocument } from '../entities/teacher-document.entity';
import { ITeacherDocumentRepository } from '../interface/teacher-document.interface';

@Injectable()
export class TypeOrmTeacherDocumentRepository implements ITeacherDocumentRepository {
    constructor(
        @InjectRepository(TeacherDocument)
        private readonly teacherDocumentRepo: Repository<TeacherDocument>,
    ) { }

    private getRepo(manager?: EntityManager): Repository<TeacherDocument> {
        return manager
            ? manager.getRepository(TeacherDocument)
            : this.teacherDocumentRepo;
    }

    create(data: TeacherDocument[], manager?: EntityManager): TeacherDocument[] {
        return this.getRepo(manager).create(data);
    }

    async save(entity: TeacherDocument[], manager?: EntityManager): Promise<TeacherDocument[]> {
        return await this.getRepo(manager).save(entity);
    }

    // async findOneById(id: number, manager?: EntityManager): Promise<StudentRegistration> {
    //     const data = await this.getRepo(manager).findOne({ where: { id } });
    //     if (!data) throw new NotFoundException('Student registration not found');
    //     return data;
    // }

    // async findAll(
    //     page: number,
    //     limit: number,
    //     manager?: EntityManager
    // ): Promise<{ items: StudentRegistration[]; total: number }> {

    //     const repo = this.getRepo(manager);

    //     const [items, total] = await repo.findAndCount({
    //         skip: (page - 1) * limit,
    //         take: limit,
    //         order: { id: 'DESC' }
    //     });

    //     return { items, total };
    // }

    // async remove(user: StudentRegistration, manager?: EntityManager): Promise<void> {
    //     if (manager) {
    //         await manager.getRepository(StudentRegistration).remove(user);
    //         return;
    //     }
    //     await this.repo.remove(user);
    // }
}