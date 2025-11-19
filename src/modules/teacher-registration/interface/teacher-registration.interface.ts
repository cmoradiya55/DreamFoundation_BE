import { StudentRegistration } from "@modules/student-registration/entity/student-registartion.entity";
import { EntityManager } from "typeorm";
import { TeacherRegistration } from "../entities/teacher-registration.entity";

export interface ITeacherRegistrationRepository {
    findByEmailOrMobile(email: string, country_code: number, mobile: number, manager?: EntityManager): Promise<TeacherRegistration | null>;
    create(user: TeacherRegistration, manager?: EntityManager): TeacherRegistration;
    save(user: TeacherRegistration, manager?: EntityManager): Promise<TeacherRegistration>;
}