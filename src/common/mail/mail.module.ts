import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { EmailTemplateService } from './service/mail-template.service';
import { EmailConfigService } from './config/mail-config.service';
import { PdfGeneratorService } from './service/pdf-generator.service';
import { MailRegistrationService } from './service/mail-registration.service';

@Module({
  controllers: [MailController],
  providers: [
    MailRegistrationService,
    MailService,
    EmailTemplateService,
    EmailConfigService,
    PdfGeneratorService
  ],
  exports: [
    MailRegistrationService,
    MailService,
  ],
})
export class MailModule { }
