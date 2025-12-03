import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IHealthyBabyCompetitionRepository } from '../interface/healthy-baby-competition.interface';
import { HealthyBabyCompetition } from '../entity/healthy-baby-competition.entity';



@Injectable()
export class TypeOrmHealthyBabyCompetitionRepository implements IHealthyBabyCompetitionRepository {
    constructor(
        @InjectRepository(HealthyBabyCompetition)
        private readonly healthyBabyCompetitionRepo: Repository<HealthyBabyCompetition>
    ) { }

    private getRepo(manager?: EntityManager): Repository<HealthyBabyCompetition> {
        return manager
            ? manager.getRepository(HealthyBabyCompetition)
            : this.healthyBabyCompetitionRepo;
    }

    create(data: HealthyBabyCompetition, manager?: EntityManager): HealthyBabyCompetition {
        return this.getRepo(manager).create(data);
    }

    async save(entity: HealthyBabyCompetition, manager?: EntityManager): Promise<HealthyBabyCompetition> {
        return await this.getRepo(manager).save(entity);
    }
}