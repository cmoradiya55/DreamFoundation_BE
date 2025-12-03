import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsInt,
  IsDateString,
  Length,
  IsNumber,
} from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';
import { Gender } from '@modules/student-registration/entity/student-registartion.entity';
import { MaxAge } from '@common/decorator/max-age.decorator';
import { MAX_AGE_ALLOWED } from '@common/constants/healthy-baby-competition.constants';

@InputType()
export class CreateHealthyBabyCompetitionDto {
  // Basic
  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  fullName: string;

  @Field(() => Gender)
  @IsEnum(Gender)
  gender: Gender;

  @Field()
  @IsDateString()
  @MaxAge(MAX_AGE_ALLOWED, `Baby must be less than ${MAX_AGE_ALLOWED} years old.`)
  dateOfBirth: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  heightInCm: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  weightInKg: number;

  // Father
  @Field()
  @IsString()
  @IsNotEmpty()
  fatherName: string;

  @Field(() => Int)
  @IsInt()
  fatherMobileCountryCode: number;

  @Field()
  @IsInt()
  fatherMobile: number;

  // Mother
  @Field()
  @IsString()
  @IsNotEmpty()
  motherName: string;

  @Field(() => Int)
  @IsInt()
  motherMobileCountryCode: number;

  @Field()
  @IsInt()
  motherMobile: number;

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

  @Field()
  @IsBoolean()
  consentFormAccepted: boolean;
}