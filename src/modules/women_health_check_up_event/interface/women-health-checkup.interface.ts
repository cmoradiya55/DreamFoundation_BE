import { EntityManager } from "typeorm";
import { WomenHealthCheckupEvent } from "../entity/women_health_check_up_event.entity";

export interface IWomenHealthCheckupEventRepository {
    findByEmailOrMobile(email: string, country_code: number, mobile: number, manager?: EntityManager): Promise<WomenHealthCheckupEvent | null>;
    create(user: WomenHealthCheckupEvent, manager?: EntityManager): WomenHealthCheckupEvent;
    save(user: WomenHealthCheckupEvent, manager?: EntityManager): Promise<WomenHealthCheckupEvent>;
}