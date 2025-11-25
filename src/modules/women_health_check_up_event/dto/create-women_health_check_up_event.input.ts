import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsInt, IsNotEmpty, IsPositive, MaxLength } from 'class-validator';

@InputType()
export class CreateWomenHealthCheckUpEventInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(255)
  fullName: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(255)
  spouseName: string;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  countryCode: number;

  @Field()
  @IsInt()
  mobile: number;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsPositive()
  donationAmount?: number;
}
