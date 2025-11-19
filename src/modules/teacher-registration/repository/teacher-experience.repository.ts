import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ITeacherExperienceRepository } from '../interface/teacher-experience.interface';
import { TeacherExperience } from '../entities/teacher-experience.entity';

@Injectable()
export class TypeOrmTeacherExperienceRepository implements ITeacherExperienceRepository {
    constructor(
        @InjectRepository(TeacherExperience)
        private readonly teacherExperienceRepo: Repository<TeacherExperience>,
    ) { }

    private getRepo(manager?: EntityManager): Repository<TeacherExperience> {
        return manager
            ? manager.getRepository(TeacherExperience)
            : this.teacherExperienceRepo;
    }

    create(data: TeacherExperience[], manager?: EntityManager): TeacherExperience[] {
        return this.getRepo(manager).create(data);
    }

    async save(entity: TeacherExperience[], manager?: EntityManager): Promise<TeacherExperience[]> {
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