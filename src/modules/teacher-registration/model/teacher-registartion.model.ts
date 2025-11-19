import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Gender } from '../dto/create-teacher-registration.input';
import { PaginatedGQLResponse } from '@common/provider/pagination/model/paginated-response.model';
import { TeacherGender } from '../entities/teacher-registration.entity';

@ObjectType()
export class TeacherDocumentResponse {
    @Field(() => Int)
    id: number;

    @Field()
    documentType: string;

    @Field()
    documentUrl: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}


@ObjectType()
export class TeacherExperienceResponse {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    totalExperienceInYear: number;

    @Field(() => Int)
    totalExperienceInMonth: number;

    @Field()
    previousSchoolName: string;

    @Field()
    designation: string;

    @Field()
    fromDate: Date;

    @Field()
    toDate: Date;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

@ObjectType()
export class TeacherQualificationResponse {
    @Field(() => Int)
    id: number;

    @Field()
    qualification: string;

    @Field()
    schoolOrCollegeName: string;

    @Field()
    boardOrUniversity: string;

    @Field(() => Int)
    year: number;

    @Field()
    percentageOrGrade: string;

    @Field()
    subjectsTaught: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

@ObjectType()
export class TeacherRegistrationResponse {
    @Field(() => Int)
    id: number;

    @Field()
    registrationNumber: string;

    @Field()
    fullName: string;

    @Field(() => TeacherGender)
    gender: TeacherGender;

    @Field({ nullable: true })
    maritalStatus?: string;

    @Field()
    dateOfBirth: Date;

    @Field(() => Int)
    countryCode: number;

    @Field()
    mobile: number;

    @Field({ nullable: true })
    email?: string;

    @Field()
    addressLine1: string;

    @Field()
    addressLine2: string;

    @Field()
    landmark: string;

    @Field()
    city: string;

    @Field()
    pincode: string;

    @Field()
    hasBasicComputerKnowledge: boolean;

    @Field()
    knowMSOffice: boolean;

    @Field()
    knowOnlineTeachingTools: boolean;

    @Field()
    declarationAccepted: boolean;

    @Field(() => Int, { nullable: true })
    status?: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(() => [TeacherQualificationResponse], { nullable: true })
    qualifications?: TeacherQualificationResponse[];

    @Field(() => [TeacherDocumentResponse], { nullable: true })
    documents?: TeacherDocumentResponse[];

    @Field(() => [TeacherExperienceResponse], { nullable: true })
    experiences?: TeacherExperienceResponse[];
}

@ObjectType()
export class TeacherRegistrationPaginatedResponse extends PaginatedGQLResponse(TeacherRegistrationResponse) { }
