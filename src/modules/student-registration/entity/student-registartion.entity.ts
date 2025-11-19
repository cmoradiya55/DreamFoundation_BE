import { registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { StudentRegistrationDocument } from './student-registration-document.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

registerEnumType(Gender, {
  name: 'Gender',
});

@Entity({ name: 'student_registration' })
export class StudentRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  registration_number?: string;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'smallint' })
  age: number;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'varchar', length: 100 })
  class: string;

  @Column({ type: 'date' })
  date_of_birth: Date;

  // Father
  @Column({ type: 'varchar', length: 255 })
  father_name: string;

  @Column({ type: 'varchar', length: 255 })
  father_occupation: string;

  @Column({ type: 'smallint' })
  father_mobile_country_code: number;

  @Column({ type: 'bigint' })
  father_mobile: number;

  @Column({ type: 'varchar', length: 255 })
  father_email: string;

  // Mother
  @Column({ type: 'varchar', length: 255 })
  mother_name: string;

  @Column({ type: 'varchar', length: 255 })
  mother_occupation: string;

  @Column({ type: 'smallint' })
  mother_mobile_country_code: number;

  @Column({ type: 'bigint' })
  mother_mobile: number;

  @Column({ type: 'varchar', length: 255 })
  mother_email: string;

  // Emergency
  @Column({ type: 'varchar', length: 255 })
  emergency_contact_name: string;

  @Column({ type: 'varchar', length: 200 })
  emergency_contact_person_relation: string;

  @Column({ type: 'smallint' })
  emergency_mobile_country_code: number;

  @Column({ type: 'bigint' })
  emergency_mobile: number;

  // Address
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

  // Medical
  @Column({ type: 'varchar', length: 15 })
  blood_group: string;

  @Column({ type: 'boolean', default: false })
  has_allergies: boolean;

  @Column({ type: 'text', nullable: true })
  allergies?: string;

  @Column({ type: 'boolean', default: false })
  has_special_needs: boolean;

  @Column({ type: 'text', nullable: true })
  special_needs?: string;

  // Acknowledgements
  @Column({ type: 'boolean', default: false })
  fees_acknowledged: boolean;

  @Column({ type: 'boolean', default: false })
  declaration_accepted: boolean;

  @Column({ type: 'boolean', default: false })
  terms_accepted: boolean;

  @Column({ type: 'smallint', default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at?: Date;

  @OneToMany(
    () => StudentRegistrationDocument,
    (doc) => doc.student,
  )
  documents: StudentRegistrationDocument[];
}
