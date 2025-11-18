import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail, Length, IsOptional, IsDateString } from 'class-validator';

@InputType()
export class UpdateStudentRegistrationInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @Length(2, 100)
  fullName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 5)
  bloodGroup?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(2, 5)
  mobileCountryCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(7, 15)
  fatherMobileNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  fatherEmail?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(7, 15)
  motherMobileNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(2, 100)
  emergencyContactName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(2, 50)
  emergencyContactRelation?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(7, 15)
  emergencyContactNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  residentialAddress?: string;

  @Field({ nullable: true })
  @IsOptional()
  landmark?: string;

  @Field({ nullable: true })
  @IsOptional()
  allergyDetails?: string;

  @Field({ nullable: true })
  @IsOptional()
  specialNeedsDetails?: string;

  @Field({ nullable: true })
  @IsOptional()
  birthCertificate?: string;

  @Field({ nullable: true })
  @IsOptional()
  passportPhoto?: string;

  @Field({ nullable: true })
  @IsOptional()
  addressProof?: string;

  @Field({ nullable: true })
  @IsOptional()
  vaccinationRecord?: string;
}
