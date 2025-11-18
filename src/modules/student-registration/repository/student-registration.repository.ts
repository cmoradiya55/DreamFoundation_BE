import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { IStudentRegistrationRepository } from '../interface/student-registration.interface';
import { StudentRegistration } from '@modules/student-registration/entity/student-registartion.entity';
import { StudentRegistrationResponse } from '../model/get-student-registartion.model';



@Injectable()
export class TypeOrmStudentRegistrationRepository implements IStudentRegistrationRepository {
    private repo: Repository<StudentRegistration>;
    constructor(private dataSource: DataSource) {
        this.repo = this.dataSource.getRepository(StudentRegistration);
    }

    private getRepo(manager?: EntityManager): Repository<StudentRegistration> {
        return manager
            ? manager.getRepository(StudentRegistration)
            : this.repo;
    }

    create(data: Partial<StudentRegistration>, manager?: EntityManager): StudentRegistration {
        return this.getRepo(manager).create(data);
    }

    async save(entity: StudentRegistration, manager?: EntityManager): Promise<StudentRegistration> {
        return await this.getRepo(manager).save(entity);
    }

    async findOneById(id: number, manager?: EntityManager): Promise<StudentRegistration> {
        const data = await this.getRepo(manager).findOne({ where: { id } });
        if (!data) throw new NotFoundException('Student registration not found');
        return data;
    }

    async findAll(
        page: number,
        limit: number,
        manager?: EntityManager
    ): Promise<{ items: StudentRegistration[]; total: number }> {

        const repo = this.getRepo(manager);

        const [items, total] = await repo.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { id: 'DESC' }
        });

        return { items, total };
    }

    async remove(user: StudentRegistration, manager?: EntityManager): Promise<void> {
        if (manager) {
            await manager.getRepository(StudentRegistration).remove(user);
            return;
        }
        await this.repo.remove(user);
    }
}