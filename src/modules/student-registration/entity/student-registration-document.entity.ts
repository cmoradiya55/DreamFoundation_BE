import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { StudentRegistration } from './student-registartion.entity';

@ObjectType()
@Entity({ name: 'student_registration_document' })
export class StudentRegistrationDocument {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => StudentRegistration)
  @ManyToOne(() => StudentRegistration, (student) => student.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: StudentRegistration;

  @Column({ name: 'student_id' })
  student_id: number;

  @Field()
  @Column({ name: 'document_type', type: 'varchar', length: 50 })
  document_type: string;

  @Field()
  @Column({ name: 'document_url', type: 'text' })
  document_url: string;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at: Date;

  @Field({ nullable: true })
  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deleted_at?: Date;
}
