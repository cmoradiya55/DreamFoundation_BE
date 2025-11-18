import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationGqlMeta {
    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    totalPages: number;
}

export function PaginatedGQLResponse<T>(classRef: new () => T) {
    @ObjectType({ isAbstract: true })
    abstract class PaginatedResponseClass {
        @Field(() => [classRef], { nullable: true })
        items: T[];

        @Field(() => PaginationGqlMeta)
        meta: PaginationGqlMeta;
    }

    return PaginatedResponseClass;
}
