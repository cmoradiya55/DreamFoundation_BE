import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsDateString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';
import { Gender } from '../entity/student-registartion.entity';
import { Type } from 'class-transformer';
import { StudentClassEnum } from '@common/enum/app.enum';
import { ENUM_MEMBER_TYPE } from '@common/constants';
import { getEnumMembers } from '@common/helper/enum.helper';

@InputType()
export class CreateStudentRegistrationDto {
  // Basic
  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  fullName: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(150)
  age: number;

  @Field(() => Gender)
  @IsEnum(Gender)
  gender: Gender;

  @Field()
  @IsEnum(StudentClassEnum, {
    message: `Module must be one of the following: ${getEnumMembers(StudentClassEnum, ENUM_MEMBER_TYPE.VALUES).join(', ')}`,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  class: string;

  @Field()
  @IsDateString()
  dateOfBirth: string;

  // Father
  @Field()
  @IsString()
  @IsNotEmpty()
  fatherName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  fatherOccupation: string;

  @Field(() => Int)
  @IsInt()
  fatherMobileCountryCode: number;

  @Field()
  @IsInt()
  fatherMobile: number;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  fatherEmail: string;

  // Mother
  @Field()
  @IsString()
  @IsNotEmpty()
  motherName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  motherOccupation: string;

  @Field(() => Int)
  @IsInt()
  motherMobileCountryCode: number;

  @Field()
  @IsInt()
  motherMobile: number;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  motherEmail: string;

  // Emergency
  @Field()
  @IsString()
  @IsNotEmpty()
  emergencyContactName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  emergencyContactRelation: string;

  @Field(() => Int)
  @IsInt()
  emergencyMobileCountryCode: number;

  @Field()
  @IsInt()
  emergencyMobile: number;

  // Address
  @Field()
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  addressLine2: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  landmark: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  city: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  pincode: string;

  // Medical
  @Field()
  @IsString()
  @IsNotEmpty()
  bloodGroup: string;

  @Field()
  @IsBoolean()
  hasAllergies: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  allergies?: string;

  @Field()
  @IsBoolean()
  hasSpecialNeeds: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  specialNeeds?: string;

  // Flags
  @Field()
  @IsBoolean()
  feesAcknowledged: boolean;

  @Field()
  @IsBoolean()
  declarationAccepted: boolean;

  @Field()
  @IsBoolean()
  termsAccepted: boolean;

  @Field(() => [StudentDocumentInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StudentDocumentInput)
  documents?: StudentDocumentInput[];
}


@InputType()
export class StudentDocumentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  documentUrl: string;
}