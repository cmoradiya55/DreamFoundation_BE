import { Field, Int, InputType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

@InputType()
export class GetStudentRegistrationDto {
    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    id: number;
}
