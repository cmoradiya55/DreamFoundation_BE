import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { WomenHealthCheckUpEventService } from './women_health_check_up_event.service';
import { CreateWomenHealthCheckUpEventInput } from './dto/create-women_health_check_up_event.input';
import { WomenHealthCheckupEvent } from './entity/women_health_check_up_event.entity';

@Resolver()
export class WomenHealthCheckUpEventResolver {
  constructor(private readonly womenHealthCheckUpEventService: WomenHealthCheckUpEventService) { }

  @Mutation(() => Boolean)
  async createWomenHealthCheckUpEvent(@Args('input') dto: CreateWomenHealthCheckUpEventInput) {
    await this.womenHealthCheckUpEventService.create(dto);
    return true;
  }
}
