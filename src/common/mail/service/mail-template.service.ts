import { Injectable, NotFoundException } from '@nestjs/common';
import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class EmailTemplateService {
  private readonly templatesPath = path.join(process.cwd(), 'src', 'common', 'mail', 'template');

  async renderTemplate(templateName: string, data: any): Promise<string> {
    try {
      const templatePath = path.join(this.templatesPath, `${templateName}.ejs`);
      console.log('Rendering template from path:', templatePath);
      await fs.access(templatePath);
      return await ejs.renderFile(templatePath, data, { async: true });
    } catch (error) {
      throw new NotFoundException(`Template not found: ${templateName}`);
    }
  }
}