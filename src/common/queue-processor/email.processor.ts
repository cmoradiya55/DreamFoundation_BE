import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { COMPANY, QUEUE } from '@common/constants';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@common/mail/mail.service';
import { AppHelper } from '@common/helper/app.helper';

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
        const { finalStudent } = job;
        console.log('Preparing to send student registration confirmation email for student:', finalStudent.emergency_mobile_country_code + finalStudent.emergency_mobile);
        const template = 'student-registration-email';
        const pdfTemplate = 'student-registration-details';

        console.log('FInal Student Data:', finalStudent);
        const student_class = AppHelper.studentClassPrefixMap(finalStudent.class);
        const templateData = {
            COMPANY,
            full_name: finalStudent.full_name,
            registration_number: finalStudent.registration_number,
            student_class: student_class,
            father_name: finalStudent.father_name,
            date_of_birth: finalStudent.date_of_birth,
            email: finalStudent.father_email,
            phone: finalStudent.father_mobile_country_code + "" + finalStudent.father_mobile,
        }

        const pdfData = {
            COMPANY,
            // Student info
            full_name: finalStudent.full_name,
            registration_number: finalStudent.registration_number,
            student_class: student_class,
            date_of_birth: finalStudent.date_of_birth,
            gender: finalStudent.gender,
            blood_group: finalStudent.blood_group,

            // Parent info
            father_name: finalStudent.father_name,
            father_occupation: finalStudent.father_occupation,
            // aaaaaaaaaaaaaa
            father_email: finalStudent.father_email,
            father_mobile: "+" + finalStudent.father_mobile_country_code + " " + finalStudent.father_mobile,
            // aaaaaaaaaaaaaa
            mother_name: finalStudent.mother_name,
            mother_occupation: finalStudent.mother_occupation,
            mother_email: finalStudent.mother_email,
            mother_mobile: "+" + finalStudent.mother_mobile_country_code + " " + finalStudent.mother_mobile,

            emergency_contact_name: finalStudent.emergency_contact_name,
            emergency_contact_relation: finalStudent.emergency_contact_person_relation,
            emergency_contact_phone: "+" + finalStudent.emergency_mobile_country_code + " " + finalStudent.emergency_mobile,
            // Address
            address_line_1: finalStudent.address_line_1,
            address_line_2: finalStudent.address_line_2,
            landmark: finalStudent.landmark,
            city: finalStudent.city,
            pincode: finalStudent.pincode,

            // Medical
            has_allergies: finalStudent.has_allergies,
            allergies: finalStudent.allergies,
            has_special_needs: finalStudent.has_special_needs,
            special_needs: finalStudent.special_needs,

            fees_acknowledged: finalStudent.fees_acknowledged,
            declaration_accepted: finalStudent.declaration_accepted,
            terms_accepted: finalStudent.terms_accepted,
            // Metadata
            created_at: finalStudent.created_at,
        }

        // render HTML and ensure it's a string before passing to sendEmail
        const html = await this.emailService.renderEmailTemplate(template, templateData);
        // render PDF and ensure it's a Buffer before attaching
        const pdfBuffer = await this.emailService.renderEmailPDF(pdfTemplate, pdfData);

        const mailOptions: any = {
            // to: finalStudent.father_email,
            to: 'ishwartrada15@gmail.com',
            subject: 'Welcome to Dream Foundation!',
            html,
        };

        mailOptions.attachments = [
            {
                filename: `${finalStudent.registration_number}_${finalStudent.full_name}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
            },
        ];

        await this.emailService.sendEmail(mailOptions);

        console.log('Handling student registration confirmation email with data: ..........');
    }

    async handleTeacherRegistrationConfirmationEmail(job) {
        console.log('Handling teacher registration confirmation email with data: ..........');
    }
}
