// import { ObjectType, Field, Int } from '@nestjs/graphql';

// @ObjectType()
// export class TeacherRegistration {
//   @Field(() => Int, { description: 'Example field (placeholder)' })
//   exampleField: number;
// }
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { TeacherDocument } from './teacher-document.entity';
import { TeacherExperience } from './teacher-experience.entity';
import { TeacherQualification } from './teacher-qualification.entity';
import { registerEnumType } from '@nestjs/graphql';


export enum TeacherGender {
  male = 'male',
  female = 'female',
  other = 'other',
}

registerEnumType(TeacherGender, {
  name: 'TeacherGender', // GraphQL enum name
  description: 'Teacher gender', // optional
});

@Entity({ name: 'teacher_registration' })
export class TeacherRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  registration_number: string;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'enum', enum: TeacherGender })
  gender: TeacherGender;

  @Column({ type: 'varchar', length: 50, nullable: true })
  marital_status: string;

  @Column({ type: 'date' })
  date_of_birth: Date;

  @Column({ type: 'smallint' })
  country_code: number;

  @Column({ type: 'bigint' })
  mobile: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'text' })
  address_line_1: string;

  @Column({ type: 'text' })
  address_line_2: string;

  @Column({ type: 'varchar', length: 255 })
  landmark: string;

  @Column({ type: 'varchar', length: 255 })
  city: string;

  @Column({ type: 'varchar', length: 50 })
  pincode: string;

  @Column({ type: 'boolean', default: false })
  has_basic_computer_knowledge: boolean;

  @Column({ type: 'boolean', default: false })
  know_ms_office: boolean;

  @Column({ type: 'boolean', default: false })
  know_online_teaching_tools: boolean;

  @Column({ type: 'boolean', default: false })
  declaration_accepted: boolean;

  @Column({ type: 'smallint', nullable: true })
  status: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  // Relations
  @OneToMany(() => TeacherQualification, (x) => x.teacher)
  qualifications: TeacherQualification[];

  @OneToMany(() => TeacherDocument, (x) => x.teacher)
  documents: TeacherDocument[];

  @OneToMany(() => TeacherExperience, (x) => x.teacher)
  experiences: TeacherExperience[];
}
