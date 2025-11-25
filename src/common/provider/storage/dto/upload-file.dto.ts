import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UploadFileDto {
  @Field(() => String)
  @IsString()
  fileName: string;

  @Field(() => String)
  @IsString()
  module: string;

  @Field(() => String)
  @IsString()
  contentType: string;
}