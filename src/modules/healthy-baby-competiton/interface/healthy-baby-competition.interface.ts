import { EntityManager } from "typeorm";
import { HealthyBabyCompetition } from "../entity/healthy-baby-competition.entity";

export interface IHealthyBabyCompetitionRepository {
    create(user: HealthyBabyCompetition, manager?: EntityManager): HealthyBabyCompetition;
    save(user: HealthyBabyCompetition, manager?: EntityManager): Promise<HealthyBabyCompetition>;
}