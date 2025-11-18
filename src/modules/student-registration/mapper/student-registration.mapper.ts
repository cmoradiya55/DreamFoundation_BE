import { StudentRegistration } from "../entity/student-registartion.entity";
import { StudentRegistrationResponse } from "../model/get-student-registartion.model";


export class StudentRegistrationMapper {

  static toResponse(entity: StudentRegistration): Partial<StudentRegistrationResponse> {
    return {
      id: entity.id,
      fullName: entity.full_name,              // <-- mapping DB field → API field
      dateOfBirth: entity.date_of_birth,
      bloodGroup: entity.blood_group,
      registrationNumber: entity.registration_number,
      createdAt: entity.created_at,
    };
  }

  static toCreateResponse(entity: StudentRegistration): Partial<StudentRegistrationResponse> {
    return {
      id: entity.id,
      registrationNumber: entity.registration_number,
    };
  }
}
