import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinColumn,
} from 'typeorm';
import { TeacherRegistration } from './teacher-registration.entity';


@Entity({ name: 'teacher_experience' })
export class TeacherExperience {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'teacher_id' })
    teacher_id: number;

    @ManyToOne(() => TeacherRegistration, (teacher) => teacher.experiences)
    @JoinColumn({ name: 'teacher_id' })
    teacher: TeacherRegistration;

    @Column({ type: 'smallint' })
    total_experience_in_year: number;

    @Column({ type: 'smallint' })
    total_experience_in_month: number;

    @Column({ type: 'varchar', length: 255 })
    previous_school_name: string;

    @Column({ type: 'varchar', length: 255 })
    designation: string;

    @Column({ type: 'date' })
    from_date: Date;

    @Column({ type: 'date' })
    to_date: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz' })
    deleted_at: Date;
}
