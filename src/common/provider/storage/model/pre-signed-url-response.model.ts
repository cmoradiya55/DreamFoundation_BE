import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PresignedUrlResponse {
  @Field()
  upload_url: string;

  @Field()
  file_url: string;
}
