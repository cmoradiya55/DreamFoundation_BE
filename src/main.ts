import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { S3Helper } from './common/helper/s3.helper';
import { TrimPipe } from './common/pipe/trim.pipe';
import { ResponseHelper } from './common/helper/response.helper';
import { PaginationService } from './common/provider/pagination/pagination.service';
import { AllExceptionsFilter } from './common/filter/http-exception.filter';
import { SerializeInterceptor } from './common/interceptor/serialize/serialize.interceptor';
import { ResponseInterceptor } from './common/interceptor/response/response.interceptor';

async function bootstrap() {
  const API_PREFIX = 'api/v1';

  const app = await NestFactory.create(AppModule);

  console.log('🚀 App started');

  const config = app.get(ConfigService);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const paginationService = app.get(PaginationService);
  const reflector = app.get(Reflector);

  app.setGlobalPrefix(API_PREFIX);
  app.useLogger(logger);

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, logger));
  app.useGlobalInterceptors(new SerializeInterceptor(reflector, paginationService), new ResponseInterceptor());
  app.use(cookieParser());
  app.useGlobalPipes(
    new TrimPipe(),
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
  // app.useGlobalGuards(jwtAuthGuard);
  S3Helper.init({
    region: config.getOrThrow<string>('aws.region'),
    accessKeyId: config.getOrThrow<string>('aws.access_key_id'),
    secretAccessKey: config.getOrThrow<string>('aws.secret_access_key'),
    bucket: config.getOrThrow<string>('aws.bucket'),
    baseUrl: config.getOrThrow<string>('aws.base_url'),
  });

  ResponseHelper.init(config.getOrThrow<string>('aws.base_url'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
