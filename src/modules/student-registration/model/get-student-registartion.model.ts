import { PaginatedGQLResponse } from '@common/provider/pagination/model/paginated-response.model';
import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@ObjectType()
export class StudentRegistrationResponse {
  @Field(() => Int)
  id: number;

  @Field()
  registrationNumber: string;

  // PERSONAL DETAILS
  @Field()
  fullName: string;

  @Field()
  dateOfBirth: Date;

  @Field({ nullable: true })
  bloodGroup: string;

  // CONTACT
  @Field()
  mobile_country_code: string;

  @Field()
  father_mobile_number: string;

  @Field({ nullable: true })
  father_email: string;

  @Field({ nullable: true })
  mother_mobile_number: string;

  // EMERGENCY
  @Field({ nullable: true })
  emergency_contact_name: string;

  @Field({ nullable: true })
  emergency_contact_relation: string;

  @Field({ nullable: true })
  emergency_contact_number: string;

  // ADDRESS
  @Field({ nullable: true })
  residential_address: string;

  @Field({ nullable: true })
  landmark: string;

  // MEDICAL
  @Field({ nullable: true })
  allergy_details: string;

  @Field({ nullable: true })
  special_needs_details: string;

  // DOCUMENTS (store file path)
  @Field({ nullable: true })
  birth_certificate: string;

  @Field({ nullable: true })
  passport_photo: string;

  @Field({ nullable: true })
  address_proof: string;

  @Field({ nullable: true })
  vaccination_record: string;

  // SYSTEM
  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class StudentRegistrationPaginatedResponse extends PaginatedGQLResponse(StudentRegistrationResponse) {
}