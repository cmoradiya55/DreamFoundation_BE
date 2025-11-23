import { Injectable, NotFoundException } from '@nestjs/common';
import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class EmailTemplateService {
  // private readonly templatesPath = path.join(process.cwd(), 'src', 'common', 'mail', 'template');
  private readonly templatesPath = path.join(__dirname, '..', 'template');

  async renderTemplate(templateName: string, data: any): Promise<string> {
    try {
      const templatePath = path.join(this.templatesPath, `${templateName}.ejs`);
      console.log('Rendering template from path:', templatePath);
      await fs.access(templatePath);
      // Use renderFile without async option (it returns a promise by default)
      const html = await new Promise<string>((resolve, reject) => {
        ejs.renderFile(templatePath, data, (err, str) => {
          if (err) reject(err);
          else resolve(str);
        });
      });
      return html;
    } catch (error) {
      console.error(`Error rendering template ${templateName}:`, error);
      throw new NotFoundException(`Template not found: ${templateName}`);
    }
  }
}