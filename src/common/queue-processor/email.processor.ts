import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE } from '@common/constants';
import { ConfigService } from '@nestjs/config';
// import axios from 'axios';
// import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { MailService } from '@common/mail/mail.service';

export const EMAIL_TYPES = {
    STUDENT_REGISTRATION_CONFIRMATION: 'sendStudentRegistrationConfirmationEmail',
    TEACHER_REGISTRATION_CONFIRMATION: 'sendTeacherRegistrationConfirmationEmail',
    OTP_EMAIL: 'sendOtpEmail',
} as const;

@Processor(QUEUE.EMAIL)
export class EmailProcessor extends WorkerHost {
    constructor(
        private readonly config: ConfigService,
        private readonly emailService: MailService,
    ) {
        super();
    }

    async process(job: Job<any>): Promise<any> {
        console.log('EmailProcessor received job:', job.name, 'with data:', job.data);
        switch (job.name) {
            case EMAIL_TYPES.STUDENT_REGISTRATION_CONFIRMATION:
                console.log('Processing student registration confirmation email job:', job.data);
                return this.handleStudentRegistrationConfirmationEmail(job.data);

            case EMAIL_TYPES.TEACHER_REGISTRATION_CONFIRMATION:
                console.log('Processing teacher registration confirmation email job:', job.data);
                return this.handleTeacherRegistrationConfirmationEmail(job.data);

            case EMAIL_TYPES.OTP_EMAIL:
                console.log('Processing sendOtpEmail job:', job.data);
                return this.handleSendOtpEmail(job.data);

            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }


    async handleSendOtpEmail(job) {
        const { email, otp, name } = job;
        console.log('Sending OTP email to:', email, 'with OTP:', otp, 'and name:', name);

        // try {
        //     const response = await lastValueFrom(
        //         this.httpService.post(
        //             this.config.getOrThrow<string>('zepto.url'),
        //             {
        //                 mail_template_key: this.config.getOrThrow<string>('zepto.template_key'),
        //                 from: { address: 'noreply@scrapexworldwide.com', name: 'noreply' },
        //                 to: [{ email_address: { address: email, name } }],
        //                 merge_info: {
        //                     name,
        //                     OTP: otp,
        //                 },
        //             },
        //             {
        //                 headers: {
        //                     Accept: 'application/json',
        //                     Authorization: 'Zoho-enczapikey PHtE6r0FRe/v2Gd5oRVT7fa/F8eiMNt9r74zKVIUuYdFW/dXHU0G+toswDWy+RktXfcRFvCemt1o5bPP5e+Ad2u4ZmsYVGqyqK3sx/VYSPOZsbq6x00Zs1sfc0TbV4XvddRr0iPfu9rSNA==',
        //                     'Cache-Control': 'no-cache',
        //                     'Content-Type': 'application/json',
        //                 },
        //                 timeout: 30000, // 30 seconds timeout like in your PHP code
        //             },
        //         )
        //     );

        //     // Optionally, handle response or log it
        //     console.log('Email sent successfully', response.data);
        // } catch (error) {
        //     console.error('Failed to send OTP email:', error.message || error);
        //     // Optionally throw to let Bull retry if desired
        //     throw error;
        // }
    }

    async handleStudentRegistrationConfirmationEmail(job) {
        this.emailService.sendWelcomeEmail({
            to: 'ishwartrada15@gmail.com',
            subject: 'Welcome to Our Platform! 🎉',
            templateData: {
                userName: 'John Doe',
                subject: 'Welcome!',
            }
        })
        console.log('Handling student registration confirmation email with data: ..........');
    }

    async handleTeacherRegistrationConfirmationEmail(job) {
        console.log('Handling teacher registration confirmation email with data: ..........');
    }
}
