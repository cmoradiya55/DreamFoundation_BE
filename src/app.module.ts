import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncOptions } from '@db/data-source';
import { BaseModule } from '@common/provider/base/base.module';
import { PaginationModule } from '@common/provider/pagination/pagination.module';
import { LoggerConfigService } from '@common/provider/logger/logger.service';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { StudentRegistrationModule } from '@modules/student-registration/student-registration.module';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from '@common/queue-processor/email.processor';
import { TeacherRegistrationModule } from './modules/teacher-registration/teacher-registration.module';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useClass: LoggerConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: config,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncOptions),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host'),
          password: config.get<string>('redis.password'),
          port: config.get<number>('redis.port'),
        },
      }),
    }),
    BaseModule,
    PaginationModule,
    // Module Imports
    StudentRegistrationModule,
    TeacherRegistrationModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailProcessor],
})
export class AppModule { }
