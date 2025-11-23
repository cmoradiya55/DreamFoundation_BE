import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailConfigService {
    private transporter: Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.getOrThrow<string>('mail.host'),
            port: this.configService.getOrThrow<number>('mail.port'),
            // secure: this.configService.getOrThrow<boolean>('mail.secure'),
            // secure: true,
            // Fix SSL/TLS issues
            tls: {
                rejectUnauthorized: false,
            },
            auth: {
                user: this.configService.getOrThrow<string>('mail.from'),
                pass: this.configService.getOrThrow<string>('mail.pass'),
            },
        });
    }

    getTransporter(): Transporter {
        return this.transporter;
    }

    getFromAddress(): string {
        return this.configService.getOrThrow<string>('mail.from');
    }

    getFromName(): string {
        return this.configService.getOrThrow<string>('mail.from_name');
    }
}