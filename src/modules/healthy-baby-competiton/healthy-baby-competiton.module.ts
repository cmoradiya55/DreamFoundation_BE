import { Module } from '@nestjs/common';
import { HealthyBabyCompetitonService } from './healthy-baby-competiton.service';
import { HealthyBabyCompetitonResolver } from './healthy-baby-competiton.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthyBabyCompetition } from './entity/healthy-baby-competition.entity';
import { TypeOrmHealthyBabyCompetitionRepository } from './repository/healthy-baby-competition.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([HealthyBabyCompetition]),
  ],
  providers: [
    HealthyBabyCompetitonResolver,
    HealthyBabyCompetitonService,
    {
      provide: 'IHealthyBabyCompetitionRepository',
      useClass: TypeOrmHealthyBabyCompetitionRepository,
    },
  ],
})
export class HealthyBabyCompetitonModule { }
