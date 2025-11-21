import { Injectable, Logger } from '@nestjs/common';
import { EmailConfigService } from './config/mail-config.service';
import { EmailTemplateService } from './service/mail-template.service';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly emailConfigService: EmailConfigService,
        private readonly emailTemplateService: EmailTemplateService,
    ) { }

    async sendWelcomeEmail(options: {
        to: string;
        subject: string;
        templateData: any;
    }) {
        try {
            const template = 'welcome-email';
            const info = await this.sendTemplatedEmail({
                to: options.to,
                subject: options.subject,
                template: template,
                templateData: {
                    userName: 'John Doe',
                    subject: 'Welcome!',
                    companyName: 'Your Company',
                    tagline: 'Excellence in Service',
                    logoUrl: 'https://yoursite.com/logo.png',
                    message: 'Welcome to our platform! We are excited to have you.',
                    pdfDataUrl: `google.com/pdf/data`,
                    additionalInfo: 'Your account is now active. Start exploring!',
                    companyAddress: '123 Business St, City, State 12345',
                    contactEmail: 'support@example.com',
                    contactPhone: '(555) 123-4567',
                    socialLinks: {
                        facebook: 'https://facebook.com/yourcompany',
                        twitter: 'https://twitter.com/yourcompany',
                        linkedin: 'https://linkedin.com/company/yourcompany',
                    },
                    unsubscribeUrl: 'https://yoursite.com/unsubscribe?email=user@example.com',
                },
            });
            const { success, messageId } = info;
            if (!success) {
                throw new Error(`Failed to send welcome email: ${info.error}`);
            }

            // await this.emailService.sendTemplatedEmail({
            //     to: 'user@example.com',
            //     subject: 'Welcome! 🎉',
            //     template: 'welcome-email',
            //     templateData: {
            //         userName: 'John Doe',
            //         subject: 'Welcome!',
            //         companyName: 'Your Company',
            //         tagline: 'Excellence in Service',
            //         logoUrl: 'https://yoursite.com/logo.png',
            //         message: 'Welcome to our platform! We are excited to have you.',
            //         pdfDataUrl: `${baseUrl}/pdf/data?token=${pdfToken}`,
            //         additionalInfo: 'Your account is now active. Start exploring!',
            //         companyAddress: '123 Business St, City, State 12345',
            //         contactEmail: 'support@example.com',
            //         contactPhone: '(555) 123-4567',
            //         socialLinks: {
            //             facebook: 'https://facebook.com/yourcompany',
            //             twitter: 'https://twitter.com/yourcompany',
            //             linkedin: 'https://linkedin.com/company/yourcompany',
            //         },
            //         unsubscribeUrl: 'https://yoursite.com/unsubscribe?email=user@example.com',
            //     },
            // });

            this.logger.log(`Email sent: ${messageId}`);
            return { success: true, messageId: messageId };
        } catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    private async sendTemplatedEmail(options: {
        to: string;
        subject: string;
        template: string;
        templateData: any;
    }) {
        try {
            const html = await this.emailTemplateService.renderTemplate(
                options.template,
                options.templateData,
            );

            const transporter = this.emailConfigService.getTransporter();

            const info = await transporter.sendMail({
                from: `${this.emailConfigService.getFromName()} <${this.emailConfigService.getFromAddress()}>`,
                to: options.to,
                subject: options.subject,
                html: html,
            });

            this.logger.log(`Email sent: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
}