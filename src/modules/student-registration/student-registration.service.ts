import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentRegistration } from './entity/student-registartion.entity';
import { CreateStudentRegistrationInput } from './dto/create-student-registration.dto';
import type { IStudentRegistrationRepository } from './interface/student-registration.interface';
import { BaseService } from '@common/provider/base/base.service';
import { AppHelper } from '@common/helper/app.helper';
import { PREFIX } from '@common/constants';
import { StudentRegistrationPaginatedResponse, StudentRegistrationResponse } from './model/get-student-registartion.model';
import { StudentRegistrationMapper } from './mapper/student-registration.mapper';
import { PaginationQueryDto } from '@common/provider/pagination/dto/pagination-query.dto';
import { PaginationGqlMeta } from '@common/provider/pagination/model/paginated-response.model';

@Injectable()
export class StudentRegistrationService {
  constructor(
    private readonly baseService: BaseService,
    @Inject('IStudentRegistrationRepository') private studentRegistrationRepo: IStudentRegistrationRepository,
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
    return StudentRegistrationMapper.toResponse(data);
  }

  async createStudentRegistration(dto: CreateStudentRegistrationInput) {
    return await this.baseService.catch(async (manager) => {
      // Step 1: find existence
      // const existing = await this.studentRegistrationRepo.findOneById(dto.id, manager);
      // if (existing) {
      //   throw new Error('Student with given ID already exists');
      // }

      // Step 2 - create user (no reg no yet)
      const created = this.studentRegistrationRepo.create(
        {
          full_name: dto.fullName,
          date_of_birth: new Date(dto.dateOfBirth),
          blood_group: dto.bloodGroup,
          mobile_country_code: dto.mobileCountryCode,
          father_mobile_number: dto.fatherMobileNumber,
          father_email: dto.fatherEmail,
          mother_mobile_number: dto.motherMobileNumber,
          emergency_contact_name: dto.emergencyContactName,
          emergency_contact_relation: dto.emergencyContactRelation,
          emergency_contact_number: dto.emergencyContactNumber,
          residential_address: dto.residentialAddress,
          landmark: dto.landmark,
          allergy_details: dto.allergyDetails,
          special_needs_details: dto.specialNeedsDetails,
          birth_certificate: dto.birthCertificate,
          passport_photo: dto.passportPhoto,
          address_proof: dto.addressProof,
          vaccination_record: dto.vaccinationRecord,
        } as StudentRegistration,
        manager
      );
      const saved = await this.studentRegistrationRepo.save(created, manager);

      // Step 3 - generate registration number from ID
      const regNo = AppHelper.generateRegNo(PREFIX.REGISTRATION_NUMBER, created.id);

      // Step 4 - persist reg no
      saved.registration_number = regNo;
      const updated = await this.studentRegistrationRepo.save(saved, manager);

      return StudentRegistrationMapper.toCreateResponse(updated);
    }, true);
  }
}
