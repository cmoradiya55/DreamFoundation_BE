import { StudentRegistration } from "@modules/student-registration/entity/student-registartion.entity";
import { EntityManager } from "typeorm";
import { StudentRegistrationDocument } from "../entity/student-registration-document.entity";

export interface IStudentRegistrationDocumentRepository {
    create(user: StudentRegistrationDocument, manager?: EntityManager): StudentRegistrationDocument;
    save(user: StudentRegistrationDocument[], manager?: EntityManager): Promise<StudentRegistrationDocument[]>;
    // findOneById(id: number, manager?: EntityManager): Promise<StudentRegistration>;
    // findAll(page: number, limit: number, manager?: EntityManager): Promise<{ items: StudentRegistration[]; total: number }>;
    // remove(user: StudentRegistration, manager?: EntityManager): Promise<void>;
}