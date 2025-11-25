import { Module } from '@nestjs/common';
import { WomenHealthCheckUpEventService } from './women_health_check_up_event.service';
import { WomenHealthCheckUpEventResolver } from './women_health_check_up_event.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WomenHealthCheckupEvent } from './entity/women_health_check_up_event.entity';
import { TypeOrmWomenHealthCheckupEventRepository } from './repository/women-health-checkup-event.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([WomenHealthCheckupEvent]),
  ],
  providers: [
    WomenHealthCheckUpEventResolver,
    WomenHealthCheckUpEventService,
    {
      provide: 'IWomenHealthCheckupEventRepository',
      useClass: TypeOrmWomenHealthCheckupEventRepository,
    },
  ],
})
export class WomenHealthCheckUpEventModule { }
