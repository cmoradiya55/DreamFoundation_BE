import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { EmailTemplateService } from './service/mail-template.service';
import { EmailConfigService } from './config/mail-config.service';

@Module({
  controllers: [MailController],
  providers: [MailService, EmailTemplateService, EmailConfigService],
  exports: [MailService],
})
export class MailModule { }
