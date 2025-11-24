import { Injectable, NotFoundException } from '@nestjs/common';
import { MailService } from '../mail.service';
import { ConfigService } from '@nestjs/config';
import { COMPANY, EMAIL_TYPES } from '@common/constants';
import { AppHelper } from '@common/helper/app.helper';

@Injectable()
export class MailRegistrationService {
  constructor(
    private readonly emailService: MailService,
  ) { }

  async process(job_name: string, job_data: any): Promise<any> {
    console.log('EmailProcessor received job:', job_name, 'with data:', job_data);
    switch (job_name) {
      case EMAIL_TYPES.STUDENT_REGISTRATION_CONFIRMATION:
        console.log('Processing student registration confirmation email job:', job_data);
        return this.handleStudentRegistrationConfirmationEmail(job_data);

      case EMAIL_TYPES.TEACHER_REGISTRATION_CONFIRMATION:
        console.log('Processing teacher registration confirmation email job:', job_data);
        return this.handleTeacherRegistrationConfirmationEmail(job_data);
      case EMAIL_TYPES.OTP_EMAIL:
        console.log('Processing sendOtpEmail job:', job_data);
        return this.handleSendOtpEmail(job_data);

      default:
        throw new Error(`Unknown job name: ${job_name}`);
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
    const { teacherDetails } = job;
    console.log('Preparing to send teacher registration confirmation email for:', teacherDetails.email);

    // You need to create a simple 'teacher-registration-email' template similar to the student one
    // or reuse a generic one.
    const template = 'teacher-registration-email';
    const pdfTemplate = 'teacher-registration-details';

    console.log('Final Teacher Data:', teacherDetails.registration_number);

    // 1. Prepare Data for the Email Body (HTML)
    const templateData = {
      COMPANY,
      full_name: teacherDetails.full_name,
      registration_number: teacherDetails.registration_number,
      email: teacherDetails.email,
      // Formatting phone for display
      phone: `+${teacherDetails.country_code} ${teacherDetails.mobile}`,
    };

    // 2. Prepare Data for the PDF Attachment
    // This MUST match the variable names expected by 'teacher-registration-details.ejs'
    const pdfData = {
      COMPANY,

      // --- Personal Information ---
      full_name: teacherDetails.full_name,
      registration_number: teacherDetails.registration_number,
      gender: teacherDetails.gender,
      marital_status: teacherDetails.marital_status,
      date_of_birth: teacherDetails.date_of_birth,

      // Contact
      email: teacherDetails.email,
      mobile: teacherDetails.mobile,
      country_code: teacherDetails.country_code,

      // --- Address Information ---
      address_line_1: teacherDetails.address_line_1,
      address_line_2: teacherDetails.address_line_2,
      landmark: teacherDetails.landmark,
      city: teacherDetails.city,
      pincode: teacherDetails.pincode,

      // --- Skills & Competencies ---
      has_basic_computer_knowledge: teacherDetails.has_basic_computer_knowledge,
      know_ms_office: teacherDetails.know_ms_office,
      know_online_teaching_tools: teacherDetails.know_online_teaching_tools,

      // --- Meta Data ---
      declaration_accepted: teacherDetails.declaration_accepted,
      created_at: teacherDetails.created_at,

      // --- CRITICAL: Relational Arrays ---
      // These keys (qualifications, experiences) match the logic I wrote in your EJS file.
      // Ensure your backend query actually fetching these relations!
      qualifications: teacherDetails.qualifications || [],
      experiences: teacherDetails.experiences || [],
      documents: teacherDetails.documents || [],
    };

    // 3. Render HTML Body
    const html = await this.emailService.renderEmailTemplate(template, templateData);

    // 4. Render PDF Attachment
    const pdfBuffer = await this.emailService.renderEmailPDF(pdfTemplate, pdfData);

    const mailOptions: any = {
      // to: teacherDetails.email,
      to: 'ishwartrada15@gmail.com', // Hardcoded for testing as per your snippet
      subject: `Teacher Application Received: ${teacherDetails.full_name}`,
      html,
    };

    mailOptions.attachments = [
      {
        filename: `${teacherDetails.registration_number}_${teacherDetails.full_name.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ];

    await this.emailService.sendEmail(mailOptions);

    console.log('Teacher registration email sent successfully.');
  }
}