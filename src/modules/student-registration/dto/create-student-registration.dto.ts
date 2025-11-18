import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Length, IsOptional, IsDateString } from 'class-validator';

@InputType()
export class CreateStudentRegistrationInput {
  @Field()
  @IsNotEmpty()
  @Length(2, 100)
  fullName: string;

  @Field()
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  @Length(1, 5)
  bloodGroup: string;

  @Field({ defaultValue: "+91" })
  @Length(2, 5)
  mobileCountryCode: string;

  @Field()
  @Length(7, 15)
  fatherMobileNumber: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  @IsEmail()
  fatherEmail: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  @Length(7, 15)
  motherMobileNumber: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  @Length(2, 100)
  emergencyContactName: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  @Length(2, 50)
  emergencyContactRelation: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  @Length(7, 15)
  emergencyContactNumber: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  residentialAddress: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  landmark: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  allergyDetails: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  specialNeedsDetails: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  birthCertificate: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  passportPhoto: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  addressProof: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  vaccinationRecord: string;
}
