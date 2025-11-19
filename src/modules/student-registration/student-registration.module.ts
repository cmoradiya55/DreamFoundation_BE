import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentRegistrationService } from './student-registration.service';
import { StudentRegistration } from './entity/student-registartion.entity';
import { StudentRegistrationResolver } from './student-registration.resolver';
import { TypeOrmStudentRegistrationRepository } from './repository/student-registration.repository';
import { TypeOrmStudentRegistrationDocumentRepository } from './repository/student-registration-document.repository';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE } from '@common/constants';

@Module({
  imports: [
    BullModule.registerQueueAsync(
      { name: QUEUE.EMAIL },
    ),
    TypeOrmModule.forFeature([StudentRegistration])
  ],
  providers: [StudentRegistrationService, StudentRegistrationResolver,// BIND THE INTERFACE TOKEN TO THE IMPLEMENTATION
    {
      provide: 'IStudentRegistrationRepository',
      useClass: TypeOrmStudentRegistrationRepository,
    },
    {
      provide: 'IStudentRegistrationDocumentRepository',
      useClass: TypeOrmStudentRegistrationDocumentRepository,
    },
  ],
  exports: [
    'IStudentRegistrationRepository',
    'IStudentRegistrationDocumentRepository',
    StudentRegistrationService,
  ],
})
export class StudentRegistrationModule { }
