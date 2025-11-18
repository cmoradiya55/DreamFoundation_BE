import { StudentRegistration } from "@modules/student-registration/entity/student-registartion.entity";
import { EntityManager } from "typeorm";

export interface IStudentRegistrationRepository {
    create(user: StudentRegistration, manager?: EntityManager): StudentRegistration;
    save(user: StudentRegistration, manager?: EntityManager): Promise<StudentRegistration>;
    findOneById(id: number, manager?: EntityManager): Promise<StudentRegistration>;
    findAll(page: number, limit: number, manager?: EntityManager): Promise<{ items: StudentRegistration[]; total: number }>;
    remove(user: StudentRegistration, manager?: EntityManager): Promise<void>;
}