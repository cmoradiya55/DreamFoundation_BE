import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ITeacherQualificationRepository } from '../interface/teacher-qualification.interface';
import { TeacherQualification } from '../entities/teacher-qualification.entity';

@Injectable()
export class TypeOrmTeacherQualificationRepository implements ITeacherQualificationRepository {
    constructor(
        @InjectRepository(TeacherQualification)
        private readonly teacherQualificationRepo: Repository<TeacherQualification>,
    ) { }

    private getRepo(manager?: EntityManager): Repository<TeacherQualification> {
        return manager
            ? manager.getRepository(TeacherQualification)
            : this.teacherQualificationRepo;
    }

    create(data: TeacherQualification[], manager?: EntityManager): TeacherQualification[] {
        return this.getRepo(manager).create(data);
    }

    async save(entity: TeacherQualification[], manager?: EntityManager): Promise<TeacherQualification[]> {
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