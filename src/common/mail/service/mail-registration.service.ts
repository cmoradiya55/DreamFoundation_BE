import { Injectable, NotFoundException } from '@nestjs/common';
import { MailService } from '../mail.service';
import axios from 'axios';
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
    const { studentDetails } = job;
    console.log('Preparing to send student registration confirmation email for student:', studentDetails.emergency_mobile_country_code + studentDetails.emergency_mobile);
    const template = 'student-registration-email';
    const pdfTemplate = 'student-registration-details';

    console.log('FInal Student Data:', studentDetails);
    const student_class = AppHelper.studentClassPrefixMap(studentDetails.class);
    const templateData = {
      COMPANY,
      full_name: studentDetails.full_name,
      registration_number: studentDetails.registration_number,
      student_class: student_class,
      father_name: studentDetails.father_name,
      date_of_birth: studentDetails.date_of_birth,
      email: studentDetails.father_email,
      phone: studentDetails.father_mobile_country_code + "" + studentDetails.father_mobile,
    }

    const pdfData = {
      COMPANY,
      // Student info
      full_name: studentDetails.full_name,
      registration_number: studentDetails.registration_number,
      student_class: student_class,
      date_of_birth: studentDetails.date_of_birth,
      gender: studentDetails.gender,
      blood_group: studentDetails.blood_group,

      // Parent info
      father_name: studentDetails.father_name,
      father_occupation: studentDetails.father_occupation,
      // aaaaaaaaaaaaaa
      father_email: studentDetails.father_email,
      father_mobile: "+" + studentDetails.father_mobile_country_code + " " + studentDetails.father_mobile,
      // aaaaaaaaaaaaaa
      mother_name: studentDetails.mother_name,
      mother_occupation: studentDetails.mother_occupation,
      mother_email: studentDetails.mother_email,
      mother_mobile: "+" + studentDetails.mother_mobile_country_code + " " + studentDetails.mother_mobile,

      emergency_contact_name: studentDetails.emergency_contact_name,
      emergency_contact_relation: studentDetails.emergency_contact_person_relation,
      emergency_contact_phone: "+" + studentDetails.emergency_mobile_country_code + " " + studentDetails.emergency_mobile,
      // Address
      address_line_1: studentDetails.address_line_1,
      address_line_2: studentDetails.address_line_2,
      landmark: studentDetails.landmark,
      city: studentDetails.city,
      pincode: studentDetails.pincode,

      // Medical
      has_allergies: studentDetails.has_allergies,
      allergies: studentDetails.allergies,
      has_special_needs: studentDetails.has_special_needs,
      special_needs: studentDetails.special_needs,

      fees_acknowledged: studentDetails.fees_acknowledged,
      declaration_accepted: studentDetails.declaration_accepted,
      terms_accepted: studentDetails.terms_accepted,
      // Metadata
      created_at: studentDetails.created_at,
      documents: studentDetails.documents || [],
    }

    // render HTML and ensure it's a string before passing to sendEmail
    const html = await this.emailService.renderEmailTemplate(template, templateData);
    // render PDF and ensure it's a Buffer before attaching
    const pdfBuffer = await this.emailService.renderEmailPDF(pdfTemplate, pdfData);

    const mailOptions: any = {
      to: studentDetails.father_email,
      subject: 'Welcome to Dream Foundation!',
      html,
    };

    console.log('----------------------------------------')
    console.log(studentDetails.documents);
    const documentAttachments = await this.preparePdfAttachmentArray(studentDetails.documents);

    mailOptions.attachments = [
      {
        filename: `${studentDetails.registration_number}_${studentDetails.full_name}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
      ...documentAttachments
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
      to: teacherDetails.email,
      subject: `Teacher Application Received: ${teacherDetails.full_name}`,
      html,
    };

    const documentAttachments = await this.preparePdfAttachmentArray(teacherDetails.documents);

    mailOptions.attachments = [
      {
        filename: `${teacherDetails.registration_number}_${teacherDetails.full_name.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
      ...documentAttachments,
    ];

    console.log('Final mail options for teacher registration email:', mailOptions.attachments);

    await this.emailService.sendEmail(mailOptions);

    console.log('Teacher registration email sent successfully.');
  }

  async fetchFileBuffer(url) {
    console.log('Fetching file from URL:', url);
    // check if URL is valid
    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      // just return empty buffer
      return Buffer.from([]);
    }
    const res = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(res.data);
  }

  private async preparePdfAttachmentArray(documents): Promise<{ filename?: string; content: Buffer; contentType: string }[]> {
    const documentAttachments: { filename?: string; content: Buffer; contentType: string }[] = [];

    for (const doc of documents || []) {
      if (!doc.document_url) continue;

      const isPdf = doc.document_url.toLowerCase().endsWith(".pdf");

      if (!isPdf) continue;

      const buffer = await this.fetchFileBuffer(doc.document_url);

      documentAttachments.push({
        filename: doc.document_type,
        content: buffer,
        contentType: "application/pdf",
      });
    }
    console.log('Prepared document attachments:', documentAttachments);

    return documentAttachments;
  }
}