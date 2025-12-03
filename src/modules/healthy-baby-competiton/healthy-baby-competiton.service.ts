import { BaseService } from '@common/provider/base/base.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateHealthyBabyCompetitionDto } from './dto/create-healthy-baby-competition.dto';
import { HealthyBabyCompetition } from './entity/healthy-baby-competition.entity';
import type { IHealthyBabyCompetitionRepository } from './interface/healthy-baby-competition.interface';

@Injectable()
export class HealthyBabyCompetitonService {
    constructor(
        private readonly baseService: BaseService,
        @Inject('IHealthyBabyCompetitionRepository') private healthyBabyCompetitionRepo: IHealthyBabyCompetitionRepository,
    ) { }

    async healthyBabyCompetitionRegistration(dto: CreateHealthyBabyCompetitionDto) {
        return await this.baseService.catch(async () => {
            const {
                fullName,
                gender,
                dateOfBirth,
                heightInCm,
                weightInKg,
                fatherName,
                fatherMobileCountryCode,
                fatherMobile,
                motherName,
                motherMobileCountryCode,
                motherMobile,
                emergencyContactName,
                emergencyContactRelation,
                emergencyMobileCountryCode,
                emergencyMobile,
                consentFormAccepted
            } = dto;

            if (!consentFormAccepted) {
                throw new BadRequestException('Consent form must be accepted to proceed with the registration');
            }

            const healthyBabyCompetitionData = this.healthyBabyCompetitionRepo.create({
                full_name: fullName,
                gender,
                date_of_birth: dateOfBirth,
                height_in_cm: heightInCm,
                weight_in_kg: weightInKg,
                father_name: fatherName,
                father_mobile_country_code: fatherMobileCountryCode,
                father_mobile: fatherMobile,
                mother_name: motherName,
                mother_mobile_country_code: motherMobileCountryCode,
                mother_mobile: motherMobile,
                emergency_contact_name: emergencyContactName,
                emergency_contact_person_relation: emergencyContactRelation,
                emergency_mobile_country_code: emergencyMobileCountryCode,
                emergency_mobile: emergencyMobile,
                consent_form_accepted: consentFormAccepted
            } as HealthyBabyCompetition);

            await this.healthyBabyCompetitionRepo.save(healthyBabyCompetitionData);
            return;
        });
    }
}
