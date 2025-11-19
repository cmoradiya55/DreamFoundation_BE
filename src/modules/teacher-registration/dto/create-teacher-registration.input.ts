import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsInt,
  IsDateString,
  Length,
  Min,
  Max,
} from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';
import { TeacherGender } from '../entities/teacher-registration.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// -------------------- DOCUMENTS --------------------
@InputType()
export class TeacherDocumentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  documentURL: string;
}

// -------------------- QUALIFICATIONS --------------------
@InputType()
export class TeacherQualificationInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  qualification: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  schoolCollegeName: string;

  @Field()
  @IsString()
  boardUniversityName: string;

  @Field(() => Int)
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @Field()
  @IsString()
  percentageOrGrade: string;

  @Field()
  @IsString()
  subjectsTaught: string;
}

// -------------------- TEACHING EXPERIENCE --------------------
@InputType()
export class TeacherExperienceInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  totalExperienceInYears: string; // frontend sends "2"

  @Field()
  @IsString()
  @IsNotEmpty()
  totalExperienceInMonths: string; // frontend sends "2"

  @Field()
  @IsString()
  @IsNotEmpty()
  previousSchoolName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  designation: string;

  @Field()
  @IsDateString()
  fromDate: string;

  @Field()
  @IsDateString()
  toDate: string;
}

// -------------------- MAIN DTO --------------------
@InputType()
export class CreateTeacherRegistrationDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @Field(() => TeacherGender)
  @IsEnum(TeacherGender)
  gender: TeacherGender;

  @Field()
  @IsString()
  @IsNotEmpty()
  maritalStatus: string;

  @Field()
  @IsDateString()
  dateOfBirth: string;

  @Field()
  @IsInt()
  mobile: number;

  @Field(() => Int)
  @IsInt()
  mobileCountryCode: number;

  @Field({ nullable: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

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

  // KNOWLEDGE FLAGS
  @Field()
  @IsBoolean()
  hasBasicComputerKnowledge: boolean;

  @Field()
  @IsBoolean()
  knowMSOffice: boolean;

  @Field()
  @IsBoolean()
  knowOnlineTeachingTools: boolean;

  // DECLARATION
  @Field()
  @IsBoolean()
  declarationAccepted: boolean;

  // DOCUMENTS
  @Field(() => [TeacherDocumentInput], { nullable: true })
  @IsOptional()
  documents?: TeacherDocumentInput[];

  // QUALIFICATIONS
  @Field(() => [TeacherQualificationInput], { nullable: true })
  @IsOptional()
  educationalQualifications?: TeacherQualificationInput[];

  // EXPERIENCE
  @Field(() => [TeacherExperienceInput], { nullable: true })
  @IsOptional()
  teachingExperiences?: TeacherExperienceInput[];
}
