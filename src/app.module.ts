import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncOptions } from '@db/data-source';
import { BaseModule } from '@common/provider/base/base.module';
import { PaginationModule } from '@common/provider/pagination/pagination.module';
import { LoggerConfigService } from '@common/provider/logger/logger.service';

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
    BaseModule,
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
