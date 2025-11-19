import { Module } from '@nestjs/common';
import { TeacherRegistrationService } from './teacher-registration.service';
import { TeacherRegistrationResolver } from './teacher-registration.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherRegistration } from './entities/teacher-registration.entity';
import { TeacherQualification } from './entities/teacher-qualification.entity';
import { TeacherExperience } from './entities/teacher-experience.entity';
import { TeacherDocument } from './entities/teacher-document.entity';
import { TypeOrmTeacherRegistrationRepository } from './repository/teacher-registartion.repository';
import { TypeOrmTeacherQualificationRepository } from './repository/teacher-qualification.repository';
import { TypeOrmTeacherExperienceRepository } from './repository/teacher-experience.repository';
import { TypeOrmTeacherDocumentRepository } from './repository/teacher-document.repository';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE } from '@common/constants';

@Module({
  imports: [
    BullModule.registerQueueAsync(
      { name: QUEUE.EMAIL },
    ),
    TypeOrmModule.forFeature([TeacherRegistration, TeacherQualification, TeacherExperience, TeacherDocument]),
  ],
  providers: [
    TeacherRegistrationResolver,
    TeacherRegistrationService,
    {
      provide: 'ITeacherRegistrationRepository',
      useClass: TypeOrmTeacherRegistrationRepository,
    },
    {
      provide: 'ITeacherQualificationRepository',
      useClass: TypeOrmTeacherQualificationRepository,
    },
    {
      provide: 'ITeacherExperienceRepository',
      useClass: TypeOrmTeacherExperienceRepository,
    },
    {
      provide: 'ITeacherDocumentRepository',
      useClass: TypeOrmTeacherDocumentRepository,
    }
  ],
  exports: [
    'ITeacherRegistrationRepository',
    'ITeacherQualificationRepository',
    'ITeacherExperienceRepository',
    'ITeacherDocumentRepository',
    TeacherRegistrationService,
  ],
})
export class TeacherRegistrationModule { }
