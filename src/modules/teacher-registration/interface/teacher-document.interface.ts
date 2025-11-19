import { EntityManager } from "typeorm";
import { TeacherDocument } from "../entities/teacher-document.entity";

export interface ITeacherDocumentRepository {
    create(user: TeacherDocument[], manager?: EntityManager): TeacherDocument[];
    save(user: TeacherDocument[], manager?: EntityManager): Promise<TeacherDocument[]>;
}