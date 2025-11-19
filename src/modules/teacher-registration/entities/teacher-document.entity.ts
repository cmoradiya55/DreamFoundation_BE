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

@Entity({ name: 'teacher_document' })
export class TeacherDocument {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'teacher_id' })
    teacher_id: number;

    @ManyToOne(() => TeacherRegistration, (teacher) => teacher.documents)
    @JoinColumn({ name: 'teacher_id' })
    teacher: TeacherRegistration;

    @Column()
    document_type: string;

    @Column()
    document_url: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz' })
    deleted_at: Date;
}
