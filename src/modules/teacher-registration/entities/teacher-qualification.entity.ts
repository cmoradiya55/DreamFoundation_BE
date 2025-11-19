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

@Entity({ name: 'teacher_qualification' })
export class TeacherQualification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'teacher_id' })
  teacher_id: number;

  @ManyToOne(() => TeacherRegistration, (teacher) => teacher.qualifications)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherRegistration;

  @Column({ type: 'varchar', length: 255 })
  qualification: string;

  @Column({ type: 'varchar', length: 255 })
  school_or_college_name: string;

  @Column({ type: 'varchar', length: 255 })
  board_or_university: string;

  @Column({ type: 'smallint' })
  year: number;

  @Column({ type: 'varchar', length: 255 })
  percentage_or_grade: string;

  @Column({ type: 'text' })
  subjects_taught: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;
}
