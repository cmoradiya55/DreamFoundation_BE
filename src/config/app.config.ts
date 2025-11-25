import { registerAs } from "@nestjs/config";

export const appConfig = registerAs('app', () => ({
    port: process.env.APP_PORT || 3000,
    name: process.env.APP_NAME || 'Dream Foundation',
    guest_token: process.env.GUEST_TOKEN,
    login_maximum_attempts: parseInt(process.env.LOGIN_MAXIMUM_ATTEMPTS || '5', 10),
    otp_maximum_attempts: parseInt(process.env.OTP_MAXIMUM_ATTEMPTS || '5', 10),
    otp_window_minutes: parseInt(process.env.OTP_WINDOW_MINUTES || '5', 10),
    otp_block_minutes: parseInt(process.env.OTP_BLOCK_MINUTES || '5', 10),
    email_maximum_attempts: parseInt(process.env.EMAIL_MAXIMUM_ATTEMPTS || '5', 10),
    email_window_minutes: parseInt(process.env.EMAIL_WINDOW_MINUTES || '5', 10),
    email_block_minutes: parseInt(process.env.EMAIL_BLOCK_MINUTES || '5', 10),
    auction_url: process.env.AUCTION_URL,
}));

export const awsConfig = registerAs('aws', () => ({
    region: process.env.AWS_REGION,
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_S3_BUCKET,
    base_url: process.env.AWS_S3_PUBLIC_BASE_URL,
    use_path_style_endpoint: process.env.AWS_USE_PATH_STYLE_ENDPOINT,
    presigned_url_expiration: process.env.PRESIGNED_URL_EXPIRATION,
}));

export const redisConfig = registerAs('redis', () => ({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
}));

export const mailConfig = registerAs('mail', () => ({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    from: process.env.MAIL_USER,
    from_name: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASS,
}));

export const puppeteerConfig = registerAs('puppeteer', () => ({
    executable_path: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
}));