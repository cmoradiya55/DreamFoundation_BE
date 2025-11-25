import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer, { Browser } from 'puppeteer';

export interface PdfGenerationResult {
    buffer: Buffer;
    fileName: string;
}

@Injectable()
export class PdfGeneratorService {
    private readonly logger = new Logger(PdfGeneratorService.name);

    constructor(private readonly configService: ConfigService) { }

    /**
     * Generate PDF from HTML and optionally upload to S3
     */
    async generatePdfFromHtml(html: string): Promise<Buffer> {
        let browser: Browser | null = null;

        try {
            // Launch Puppeteer
            browser = await puppeteer.launch({
                headless: true,
                // executablePath: this.configService.getOrThrow<string>('puppeteer.executable_path'),
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                ],
            });

            const page = await browser.newPage();

            // Set content
            await page.setContent(html, {
                waitUntil: 'networkidle0',
                timeout: 30000,
            });

            // Generate PDF
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px',
                },
            });

            return Buffer.from(pdfBuffer);
        } catch (error) {
            this.logger.error(`Failed to generate PDF: ${error.message}`);
            throw error;
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}