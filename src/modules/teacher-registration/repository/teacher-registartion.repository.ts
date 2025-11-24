import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { ITeacherRegistrationRepository } from '../interface/teacher-registration.interface';
import { TeacherRegistration } from '../entities/teacher-registration.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmTeacherRegistrationRepository implements ITeacherRegistrationRepository {
    constructor(
        @InjectRepository(TeacherRegistration)
        private readonly teacherRegistrationRepo: Repository<TeacherRegistration>,
    ) { }

    private getRepo(manager?: EntityManager): Repository<TeacherRegistration> {
        return manager
            ? manager.getRepository(TeacherRegistration)
            : this.teacherRegistrationRepo;
    }

    async findByEmailOrMobile(email: string, country_code: number, mobile: number, manager?: EntityManager): Promise<TeacherRegistration | null> {
        return await this.getRepo(manager).findOne({ where: [{ email }, { country_code, mobile }] });
    }

    create(data: TeacherRegistration, manager?: EntityManager): TeacherRegistration {
        return this.getRepo(manager).create(data);
    }

    async save(entity: TeacherRegistration, manager?: EntityManager): Promise<TeacherRegistration> {
        return await this.getRepo(manager).save(entity);
    }

    async findOneById(id: number, manager?: EntityManager): Promise<TeacherRegistration> {
        const data = await this.getRepo(manager).findOne({
            where: {
                id
            },
            relations: {
                documents: true,
                qualifications: true,
                experiences: true
            }
        });

        if (!data) throw new NotFoundException('Teacher registration not found');
        return data;
    }

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