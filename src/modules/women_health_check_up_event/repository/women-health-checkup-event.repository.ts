import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { StudentRegistration } from '@modules/student-registration/entity/student-registartion.entity';
import { WomenHealthCheckupEvent } from '../entity/women_health_check_up_event.entity';
import { IWomenHealthCheckupEventRepository } from '../interface/women-health-checkup.interface';
import { InjectRepository } from '@nestjs/typeorm';



@Injectable()
export class TypeOrmWomenHealthCheckupEventRepository implements IWomenHealthCheckupEventRepository {
    private repo: Repository<WomenHealthCheckupEvent>;
    constructor(
        @InjectRepository(WomenHealthCheckupEvent)
        private readonly womenhealthCheckupRepo: Repository<WomenHealthCheckupEvent>
    ) { }

    private getRepo(manager?: EntityManager): Repository<WomenHealthCheckupEvent> {
        return manager
            ? manager.getRepository(WomenHealthCheckupEvent)
            : this.womenhealthCheckupRepo;
    }

    create(data: WomenHealthCheckupEvent, manager?: EntityManager): WomenHealthCheckupEvent {
        return this.getRepo(manager).create(data);
    }

    async save(entity: WomenHealthCheckupEvent, manager?: EntityManager): Promise<WomenHealthCheckupEvent> {
        return await this.getRepo(manager).save(entity);
    }

    async findByEmailOrMobile(email: string, country_code: number, mobile: number, manager?: EntityManager): Promise<WomenHealthCheckupEvent | null> {
        return await this.getRepo(manager).findOne({ where: [{ email }, { country_code, mobile }] });
    }
}