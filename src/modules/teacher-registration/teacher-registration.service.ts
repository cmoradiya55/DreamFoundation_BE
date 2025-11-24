import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTeacherRegistrationDto } from './dto/create-teacher-registration.input';
import { BaseService } from '@common/provider/base/base.service';
import type { ITeacherQualificationRepository } from './interface/teacher-qualification.interface';
import type { ITeacherRegistrationRepository } from './interface/teacher-registration.interface';
import type { ITeacherDocumentRepository } from './interface/teacher-document.interface';
import type { ITeacherExperienceRepository } from './interface/teacher-experience.interface';
import { TeacherRegistrationMapper } from './mapper/teacher-registration.mapper';
import { Queue } from 'bullmq';
import { EMAIL_TYPES, QUEUE, TEACHER_REGISTRATION_PREFIX, TEACHER_REGISTRATION_STATUS } from '@common/constants';
import { InjectQueue } from '@nestjs/bullmq';
import { TeacherDocument } from './entities/teacher-document.entity';
import { TeacherQualification } from './entities/teacher-qualification.entity';
import { TeacherExperience } from './entities/teacher-experience.entity';
import { TeacherRegistration } from './entities/teacher-registration.entity';
import { AppHelper } from '@common/helper/app.helper';
import { MailRegistrationService } from '@common/mail/service/mail-registration.service';

@Injectable()
export class TeacherRegistrationService {
  constructor(
    // @InjectQueue(QUEUE.EMAIL) private emailQueue: Queue,
    private readonly emailRegistrationService: MailRegistrationService,
    private readonly baseService: BaseService,
    @Inject('ITeacherRegistrationRepository') private teacherRegistrationRepo: ITeacherRegistrationRepository,
    @Inject('ITeacherQualificationRepository') private teacherQualificationRepo: ITeacherQualificationRepository,
    @Inject('ITeacherDocumentRepository') private teacherDocumentRepo: ITeacherDocumentRepository,
    @Inject('ITeacherExperienceRepository') private teacherExperienceRepo: ITeacherExperienceRepository,

  ) { }

  async createTeacherRegistration(dto: CreateTeacherRegistrationDto) {
    return await this.baseService.catch(async (manager) => {
      // check if same registration exists with email or phone
      const {
        fullName,
        gender,
        maritalStatus,
        dateOfBirth,
        mobileCountryCode,
        mobile,
        email,
        addressLine1,
        addressLine2,
        landmark,
        city,
        pincode,
        hasBasicComputerKnowledge,
        knowMSOffice,
        knowOnlineTeachingTools,
        declarationAccepted,
        documents,
        educationalQualifications,
        teachingExperiences
      } = dto;

      const existing = await this.teacherRegistrationRepo.findByEmailOrMobile(email, mobileCountryCode, mobile, manager);
      if (existing) {
        throw new BadRequestException('A registration with the same email or mobile number already exists');
      }

      // -----------------------
      // Validation — short & strict
      // -----------------------
      if (!declarationAccepted) {
        throw new BadRequestException('All acknowledgements and declarations must be accepted');
      }

      // -----------------------
      // Step 1: Create Student
      // -----------------------
      const teacher = this.teacherRegistrationRepo.create({
        full_name: fullName,
        gender,
        marital_status: maritalStatus,
        date_of_birth: new Date(dateOfBirth),
        country_code: mobileCountryCode,
        mobile,
        email,

        address_line_1: addressLine1,
        address_line_2: addressLine2,
        landmark,
        city,
        pincode,

        has_basic_computer_knowledge: hasBasicComputerKnowledge,
        know_ms_office: knowMSOffice,
        know_online_teaching_tools: knowOnlineTeachingTools,


        declaration_accepted: declarationAccepted,

        status: TEACHER_REGISTRATION_STATUS.PENDING,
      } as TeacherRegistration, manager);

      const savedTeacher = await this.teacherRegistrationRepo.save(teacher, manager);

      const regNumber = AppHelper.generateRegNo(TEACHER_REGISTRATION_PREFIX, savedTeacher.id)
      savedTeacher.registration_number = regNumber;
      await this.teacherRegistrationRepo.save(savedTeacher, manager);

      // -----------------------
      // Step 2: Insert documents
      // -----------------------
      if (documents?.length) {
        const docEntities = this.teacherDocumentRepo.create(
          documents.map(d => ({
            teacher_id: savedTeacher.id,
            document_type: d.documentType,
            document_url: d.documentURL,
          } as TeacherDocument)),
          manager,
        );

        await this.teacherDocumentRepo.save(docEntities, manager);
      }


      // -----------------------
      // Step 2: Insert qualifications
      // -----------------------
      if (educationalQualifications?.length) {
        const qualificationEntities = this.teacherQualificationRepo.create(
          educationalQualifications.map(d => ({
            teacher_id: savedTeacher.id,
            qualification: d.qualification,
            school_or_college_name: d.schoolCollegeName,
            board_or_university: d.boardUniversityName,
            year: d.year,
            percentage_or_grade: d.percentageOrGrade,
            subjects_taught: d.subjectsTaught,
          } as TeacherQualification)),
          manager,
        );

        await this.teacherQualificationRepo.save(qualificationEntities, manager);
      }


      // -----------------------
      // Step 3: Insert teaching experiences
      // -----------------------

      if (teachingExperiences?.length) {
        const experienceEntities = this.teacherExperienceRepo.create(
          teachingExperiences.map(exp => ({
            teacher_id: savedTeacher.id,
            total_experience_in_year: Number(exp.totalExperienceInYears),
            total_experience_in_month: Number(exp.totalExperienceInMonths),
            previous_school_name: exp.previousSchoolName,
            designation: exp.designation,
            from_date: new Date(exp.fromDate),
            to_date: new Date(exp.toDate),
          }) as TeacherExperience),
          manager,
        );

        await this.teacherExperienceRepo.save(experienceEntities, manager);
      }

      const teacherDetails = await this.teacherRegistrationRepo.findOneById(savedTeacher.id, manager);

      // this.emailQueue.add(EMAIL_TYPES.TEACHER_REGISTRATION_CONFIRMATION, {})
      this.emailRegistrationService.process(EMAIL_TYPES.TEACHER_REGISTRATION_CONFIRMATION, { teacherDetails })

      return TeacherRegistrationMapper.toCreateResponse(savedTeacher);
    }, true);
  }

  findAll() {
    return `This action returns all teacherRegistration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teacherRegistration`;
  }

  // update(id: number, updateTeacherRegistrationInput: UpdateTeacherRegistrationInput) {
  //   return `This action updates a #${id} teacherRegistration`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} teacherRegistration`;
  // }
}
