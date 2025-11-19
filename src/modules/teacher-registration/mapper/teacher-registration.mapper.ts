import { TeacherRegistration } from "../entities/teacher-registration.entity";
import { TeacherRegistrationResponse } from "../model/teacher-registartion.model";


export class TeacherRegistrationMapper {

    // static toResponse(entity: TeacherRegistration): Partial<TeacherRegistrationResponse> {
    //     return {
    //         id: entity.id,
    //         fullName: entity.full_name,              // <-- mapping DB field → API field
    //         dateOfBirth: entity.date_of_birth,
    //         bloodGroup: entity.blood_group,
    //         registrationNumber: entity.registration_number,
    //         createdAt: entity.created_at,
    //     };
    // }


    // static toDetailResponse(entity: TeacherRegistration): Partial<TeacherRegistrationResponse> {
    //     return {
    //         id: entity.id,
    //         fullName: entity.full_name,              // <-- mapping DB field → API field
    //         dateOfBirth: entity.date_of_birth,
    //         bloodGroup: entity.blood_group,
    //         registrationNumber: entity.registration_number,
    //         createdAt: entity.created_at,
    //         documents: entity.documents?.map(doc => ({
    //             id: doc.id,
    //             documentType: doc.document_type,
    //             documentUrl: doc.document_url,
    //         })) || [],
    //     };
    // }

    static toCreateResponse(entity: TeacherRegistration): Partial<TeacherRegistrationResponse> {
        return {
            id: entity.id,
            registrationNumber: entity.registration_number,
        };
    }
}
