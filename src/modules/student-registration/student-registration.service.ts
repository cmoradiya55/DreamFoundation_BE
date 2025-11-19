import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentRegistration } from './entity/student-registartion.entity';
import { CreateStudentRegistrationDto } from './dto/create-student-registration.dto';
import type { IStudentRegistrationRepository } from './interface/student-registration.interface';
import { BaseService } from '@common/provider/base/base.service';
import { AppHelper } from '@common/helper/app.helper';
import { QUEUE, STUDENT_REGISTRATION_PREFIX, STUDENT_REGISTRATION_STATUS } from '@common/constants';
import { StudentRegistrationPaginatedResponse, StudentRegistrationResponse } from './model/get-student-registartion.model';
import { StudentRegistrationMapper } from './mapper/student-registration.mapper';
import { PaginationQueryDto } from '@common/provider/pagination/dto/pagination-query.dto';
import type { IStudentRegistrationDocumentRepository } from './interface/student-registration-document.interface';
import { StudentRegistrationDocument } from './entity/student-registration-document.entity';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { EMAIL_TYPES } from '@common/queue-processor/email.processor';

@Injectable()
export class StudentRegistrationService {
  constructor(
    @InjectQueue(QUEUE.EMAIL) private emailQueue: Queue,
    private readonly baseService: BaseService,
    @Inject('IStudentRegistrationRepository') private studentRegistrationRepo: IStudentRegistrationRepository,
    @Inject('IStudentRegistrationDocumentRepository') private studentRegistrationDocumentRepo: IStudentRegistrationDocumentRepository,
  ) { }

  async findAll(dto: PaginationQueryDto): Promise<StudentRegistrationPaginatedResponse> {
    const { page, limit } = dto;
    const { items, total } = await this.studentRegistrationRepo.findAll(page, limit);

    return {
      items: items.length ? items.map(item => StudentRegistrationMapper.toResponse(item) as StudentRegistrationResponse) : [],
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async findOne(id: number): Promise<Partial<StudentRegistrationResponse> | null> {
    const data = await this.studentRegistrationRepo.findOneById(+id);
    return StudentRegistrationMapper.toDetailResponse(data);
  }

  async createStudentRegistration(dto: CreateStudentRegistrationDto) {
    return await this.baseService.catch(async (manager) => {
      const {
        fullName,
        age,
        gender,
        class: studentClass,
        dateOfBirth,
        fatherName,
        fatherOccupation,
        fatherMobileCountryCode,
        fatherMobile,
        fatherEmail,
        motherName,
        motherOccupation,
        motherMobileCountryCode,
        motherMobile,
        motherEmail,
        emergencyContactName,
        emergencyContactRelation,
        emergencyMobileCountryCode,
        emergencyMobile,
        addressLine1,
        addressLine2,
        landmark,
        city,
        pincode,
        bloodGroup,
        hasAllergies,
        allergies,
        hasSpecialNeeds,
        specialNeeds,
        feesAcknowledged,
        declarationAccepted,
        termsAccepted,
        documents,
      } = dto;

      // -----------------------
      // Validation — short & strict
      // -----------------------
      if (!feesAcknowledged || !declarationAccepted || !termsAccepted) {
        throw new BadRequestException('All acknowledgements and declarations must be accepted');
      }

      if (hasAllergies && !allergies?.trim()) {
        throw new BadRequestException('Allergies details must be provided');
      }

      if (hasSpecialNeeds && !specialNeeds?.trim()) {
        throw new BadRequestException('Special needs details must be provided');
      }

      // -----------------------
      // Step 1: Create Student
      // -----------------------
      const student = this.studentRegistrationRepo.create({
        full_name: fullName,
        age,
        gender,
        class: studentClass,
        date_of_birth: new Date(dateOfBirth),

        father_name: fatherName,
        father_occupation: fatherOccupation,
        father_mobile_country_code: fatherMobileCountryCode,
        father_mobile: fatherMobile,
        father_email: fatherEmail,

        mother_name: motherName,
        mother_occupation: motherOccupation,
        mother_mobile_country_code: motherMobileCountryCode,
        mother_mobile: motherMobile,
        mother_email: motherEmail,

        emergency_contact_name: emergencyContactName,
        emergency_contact_person_relation: emergencyContactRelation,
        emergency_mobile_country_code: emergencyMobileCountryCode,
        emergency_mobile: emergencyMobile,

        address_line_1: addressLine1,
        address_line_2: addressLine2,
        landmark,
        city,
        pincode,

        blood_group: bloodGroup,

        has_allergies: hasAllergies,
        allergies,

        has_special_needs: hasSpecialNeeds,
        special_needs: specialNeeds,

        fees_acknowledged: feesAcknowledged,
        declaration_accepted: declarationAccepted,
        terms_accepted: termsAccepted,

        status: STUDENT_REGISTRATION_STATUS.PENDING,
      } as StudentRegistration, manager);

      const savedStudent = await this.studentRegistrationRepo.save(student, manager);

      // -----------------------
      // Step 2: Insert documents
      // -----------------------
      if (documents?.length) {
        const docEntities = documents.map((d) =>
          this.studentRegistrationDocumentRepo.create({
            student_id: savedStudent.id,
            document_type: d.documentType,
            document_url: d.documentUrl,
          } as StudentRegistrationDocument, manager),
        );

        await this.studentRegistrationDocumentRepo.save(docEntities, manager);
      }

      // -----------------------
      // Step 3: Generate reg no
      // -----------------------
      const prefix = STUDENT_REGISTRATION_PREFIX[studentClass];
      const regNo = AppHelper.generateRegNo(prefix, savedStudent.id);
      savedStudent.registration_number = regNo;

      const finalStudent = await this.studentRegistrationRepo.save(savedStudent, manager);

      this.emailQueue.add(EMAIL_TYPES.STUDENT_REGISTRATION_CONFIRMATION, {})

      return StudentRegistrationMapper.toCreateResponse(finalStudent);
    }, true);
  }
}
