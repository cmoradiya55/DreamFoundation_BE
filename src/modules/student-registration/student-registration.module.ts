import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentRegistrationService } from './student-registration.service';
import { StudentRegistration } from './entity/student-registartion.entity';
import { StudentRegistrationResolver } from './student-registration.resolver';
import { TypeOrmStudentRegistrationRepository } from './repository/student-registration.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StudentRegistration])],
  providers: [StudentRegistrationService, StudentRegistrationResolver,// BIND THE INTERFACE TOKEN TO THE IMPLEMENTATION
    {
      provide: 'IStudentRegistrationRepository',
      useClass: TypeOrmStudentRegistrationRepository,
    },
  ],
  exports: [
    'IStudentRegistrationRepository',
    StudentRegistrationService,
  ],
})
export class StudentRegistrationModule { }
