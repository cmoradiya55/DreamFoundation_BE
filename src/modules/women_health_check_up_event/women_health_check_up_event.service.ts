import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateWomenHealthCheckUpEventInput } from './dto/create-women_health_check_up_event.input';
import { BaseService } from '@common/provider/base/base.service';
import type { IWomenHealthCheckupEventRepository } from './interface/women-health-checkup.interface';
import { WomenHealthCheckupEvent } from './entity/women_health_check_up_event.entity';

@Injectable()
export class WomenHealthCheckUpEventService {
  constructor(
    private readonly baseService: BaseService,
    @Inject('IWomenHealthCheckupEventRepository') private womenHealthCheckUpEventRepo: IWomenHealthCheckupEventRepository,
  ) { }

  async create(dto: CreateWomenHealthCheckUpEventInput) {
    return await this.baseService.catch(async () => {
      // check if same registration exists with email or phone
      const {
        fullName,
        spouseName,
        countryCode,
        mobile,
        email,
        donationAmount
      } = dto;

      const existing = await this.womenHealthCheckUpEventRepo.findByEmailOrMobile(email, countryCode, mobile);
      if (existing) {
        throw new BadRequestException('A registration with the same email or mobile number already exists');
      }

      const womenHealthCheckUpEventData = this.womenHealthCheckUpEventRepo.create({
        full_name: fullName,
        spouse_name: spouseName,
        country_code: countryCode,
        mobile,
        email,
        donation_amount: donationAmount
      } as WomenHealthCheckupEvent);

      await this.womenHealthCheckUpEventRepo.save(womenHealthCheckUpEventData);
      return;
    }, true);
  }
}
