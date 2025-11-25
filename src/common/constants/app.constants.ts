import { StudentClassEnum } from "@common/enum/app.enum";

export const APP = {
  CODE_HASH_SALT: 'dream_foundation_salt_2025!',
} as const;

export const ENUM_MEMBER_TYPE = {
  KEYS: 'keys',
  VALUES: 'values',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAXIMUM_LIMIT: 50,
} as const;

export const OTP_TYPE = {
  SMS: 'sms',
  EMAIL: 'email',
} as const;

export const OTP_EXPIRY_MS = {
  MFA: 10 * 60 * 1000,
  MFA_ENABLED: 10 * 60 * 1000,
  MOBILE: 10 * 60 * 1000,
  EMAIL: 10 * 60 * 1000,
  PASSWORD: 10 * 60 * 1000,
} as const;

// For invalid dates or default values
export const OLD_DATE = '2000-01-01';

export const MAX_AGE_FOR_BIRTHDATE = 80;

export const S3_BUCKETS = {
  STUDENT: 'students',
  TEACHER: 'teachers',
} as const;
export const S3_BUCKET_FOLDERS = Object.values(S3_BUCKETS);

export const SYSTEM_SETTING = {
  INTEREST_PERCENTAGE: 1,
} as const;


export const STUDENT_REGISTRATION_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
} as const;

export const STUDENT_REGISTRATION_PREFIX = {
  [StudentClassEnum.TENDER_CARE]: 'TC',
  [StudentClassEnum.JUMP_START]: 'JS',
  [StudentClassEnum.PLAYGROUP]: 'PG',
  [StudentClassEnum.NURSERY]: 'NS',
  [StudentClassEnum.JR_KG]: 'JK',
  [StudentClassEnum.SR_KG]: 'SK',
} as const;

export const QUEUE = {
  EMAIL: 'email',
} as const;

export const TEACHER_REGISTRATION_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
} as const;


export const TEACHER_REGISTRATION_PREFIX = 'TR';

export const COMPANY = {
  NAME: 'Dream Foundation',
  SUB_COMPANY_1: 'Tiny Yatra',
  EMAIL: 'tinyyatra99@gmail.com',
  PHONE: '+91 63561 79699',
  ADDRESS: '123 Dream St, Imagination City, Country',
  WEBSITE: 'https://www.dreamfoundation.in/',
} as const;

export const EMAIL_TYPES = {
  STUDENT_REGISTRATION_CONFIRMATION: 'sendStudentRegistrationConfirmationEmail',
  TEACHER_REGISTRATION_CONFIRMATION: 'sendTeacherRegistrationConfirmationEmail',
  OTP_EMAIL: 'sendOtpEmail',
} as const;

export const ALLOWED_CONTENT_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'],
  PDF: ['application/pdf'],
} as const;

export const ALLOWED_CONTENT_TYPES_FLAT = [
  ...ALLOWED_CONTENT_TYPES.IMAGE,
  ...ALLOWED_CONTENT_TYPES.PDF,
];