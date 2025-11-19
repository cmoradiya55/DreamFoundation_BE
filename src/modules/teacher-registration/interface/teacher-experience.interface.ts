import { EntityManager } from "typeorm";
import { TeacherExperience } from "../entities/teacher-experience.entity";

export interface ITeacherExperienceRepository {
    create(user: TeacherExperience[], manager?: EntityManager): TeacherExperience[];
    save(user: TeacherExperience[], manager?: EntityManager): Promise<TeacherExperience[]>;
}