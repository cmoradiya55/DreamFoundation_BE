import { EntityManager } from "typeorm";
import { TeacherQualification } from "../entities/teacher-qualification.entity";

export interface ITeacherQualificationRepository {
    create(user: TeacherQualification[], manager?: EntityManager): TeacherQualification[];
    save(user: TeacherQualification[], manager?: EntityManager): Promise<TeacherQualification[]>;
}