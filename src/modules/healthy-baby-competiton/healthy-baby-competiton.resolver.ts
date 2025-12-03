import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { HealthyBabyCompetitonService } from './healthy-baby-competiton.service';
import { CreateHealthyBabyCompetitionDto } from './dto/create-healthy-baby-competition.dto';

@Resolver()
export class HealthyBabyCompetitonResolver {
  constructor(private readonly healthyBabyCompetitonService: HealthyBabyCompetitonService) { }

  @Mutation(() => Boolean)
  async healthyBabyCompetitionRegistration(@Args('healthyBabyCompetitionInput') healthyBabyCompetitionInput: CreateHealthyBabyCompetitionDto) {
    await this.healthyBabyCompetitonService.healthyBabyCompetitionRegistration(healthyBabyCompetitionInput);
    return true;
  }
}
