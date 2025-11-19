import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TeacherRegistrationService } from './teacher-registration.service';
import { CreateTeacherRegistrationDto } from './dto/create-teacher-registration.input';
import { TeacherRegistrationResponse } from './model/teacher-registartion.model';

@Resolver()
export class TeacherRegistrationResolver {
  constructor(private readonly teacherRegistrationService: TeacherRegistrationService) { }

  @Mutation(() => TeacherRegistrationResponse)
  async createTeacherRegistration(@Args('createTeacherRegistrationDto') createTeacherRegistrationDto: CreateTeacherRegistrationDto) {
    return await this.teacherRegistrationService.createTeacherRegistration(createTeacherRegistrationDto);
  }

  @Query(() => [TeacherRegistrationResponse], { name: 'teacherRegistration' })
  findAll() {
    return this.teacherRegistrationService.findAll();
  }

  @Query(() => TeacherRegistrationResponse, { name: 'teacherRegistration' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.teacherRegistrationService.findOne(id);
  }

  // @Mutation(() => TeacherRegistration)
  // updateTeacherRegistration(@Args('updateTeacherRegistrationInput') updateTeacherRegistrationInput: UpdateTeacherRegistrationInput) {
  //   return this.teacherRegistrationService.update(updateTeacherRegistrationInput.id, updateTeacherRegistrationInput);
  // }

  // @Mutation(() => TeacherRegistration)
  // removeTeacherRegistration(@Args('id', { type: () => Int }) id: number) {
  //   return this.teacherRegistrationService.remove(id);
  // }
}
