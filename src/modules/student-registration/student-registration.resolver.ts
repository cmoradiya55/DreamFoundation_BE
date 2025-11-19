import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { StudentRegistrationService } from './student-registration.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateStudentRegistrationInput } from './dto/update-student-registration.dto';
import { GetStudentRegistrationDto } from './dto/get-student-registartion.dto';
import { StudentRegistrationPaginatedResponse, StudentRegistrationResponse } from './model/get-student-registartion.model';
import { PaginationQueryDto } from '@common/provider/pagination/dto/pagination-query.dto';
import { CreateStudentRegistrationDto } from './dto/create-student-registration.dto';

@Resolver()
export class StudentRegistrationResolver {
  constructor(private readonly studentRegistrationService: StudentRegistrationService) { }


  @Mutation(() => StudentRegistrationResponse)
  async createStudentRegistration(@Args('createStudentRegistrationInput') createStudentRegistrationInput: CreateStudentRegistrationDto) {
    const data = await this.studentRegistrationService.createStudentRegistration(createStudentRegistrationInput);
    return data;
  }

  @Query(() => StudentRegistrationResponse, { name: 'studentRegistration', nullable: true })
  async getOne(@Args('input') input: GetStudentRegistrationDto): Promise<Partial<StudentRegistrationResponse> | null> {
    return await this.studentRegistrationService.findOne(input.id);
  }

  @Query(() => StudentRegistrationPaginatedResponse, { name: 'studentRegistrations' })
  async getAll(
    @Args('pagination') input: PaginationQueryDto
  ): Promise<StudentRegistrationPaginatedResponse> {
    return await this.studentRegistrationService.findAll(input);
  }


  @Mutation(() => StudentRegistrationResponse)
  async updateStudentRegistration(@Args('updateStudentRegistrationInput') updateStudentRegistrationInput: UpdateStudentRegistrationInput) {
    // const data = await this.studentRegistrationService.update(updateStudentRegistrationInput.id, updateStudentRegistrationInput);
    // return data;
  }

  @Mutation(() => StudentRegistrationResponse)
  async removeStudentRegistration(@Args('id', { type: () => Int }) id: number) {
    // return this.studentRegistrationService.remove(id);
  }
}