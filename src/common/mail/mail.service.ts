import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EmailConfigService } from './config/mail-config.service';
import { EmailTemplateService } from './service/mail-template.service';
import { PdfGeneratorService } from './service/pdf-generator.service';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly emailConfigService: EmailConfigService,
        private readonly emailTemplateService: EmailTemplateService,
        private readonly pdfService: PdfGeneratorService,
    ) { }

    async renderEmailTemplate(template: string, templateData: any) {
        try {
            const html = await this.emailTemplateService.renderTemplate(
                template,
                templateData,
            );
            if (!html) throw new BadRequestException('Failed to render email template');
            return html;
        } catch (error) {
            this.logger.error(`Failed to generate email template: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async renderEmailPDF(template: string, templateData: any) {
        try {
            // Render the email template with provided data
            const html = await this.emailTemplateService.renderTemplate(
                template,
                templateData,
            );

            const pdfBuffer = await this.pdfService.generatePdfFromHtml(html);
            if (!pdfBuffer) {
                throw new Error('PDF generation returned null or undefined buffer');
            }
            return pdfBuffer;
        } catch (error) {
            this.logger.error(`Failed to generate email PDF: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async sendEmail(options: {
        to: string;
        subject: string;
        body?: string;
        html?: string;
        attachments?: any[];
    }) {
        try {
            const transporter = await this.emailConfigService.getTransporter();

            const info = await transporter.sendMail({
                from: `${this.emailConfigService.getFromName()} <${this.emailConfigService.getFromAddress()}>`,
                to: options.to,
                subject: options.subject,
                text: options.body,
                html: options.html,
                attachments: options.attachments || [],
            });

            this.logger.log(`Email sent: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
}