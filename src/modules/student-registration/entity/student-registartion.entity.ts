import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@ObjectType()
@Entity('student_registrations')
export class StudentRegistration {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true, nullable: true })
  registration_number: string;

  // PERSONAL DETAILS
  @Field()
  @Column()
  full_name: string;

  @Field()
  @Column()
  date_of_birth: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  blood_group: string;

  // CONTACT
  @Field()
  @Column({ default: '+91' })
  mobile_country_code: string;

  @Field()
  @Column()
  father_mobile_number: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  father_email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  mother_mobile_number: string;

  // EMERGENCY
  @Field({ nullable: true })
  @Column({ nullable: true })
  emergency_contact_name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  emergency_contact_relation: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  emergency_contact_number: string;

  // ADDRESS
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  residential_address: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  landmark: string;

  // MEDICAL
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  allergy_details: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  special_needs_details: string;

  // DOCUMENTS (store file path)
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  birth_certificate: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  passport_photo: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  address_proof: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  vaccination_record: string;

  // SYSTEM
  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at?: Date;
}
