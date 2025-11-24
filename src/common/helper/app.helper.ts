import { StudentClassEnum } from "@common/enum/app.enum";

export class AppHelper {
    static generateRegNo(prefix: string, id: number): string {
        const year = new Date().getFullYear().toString();
        return `${prefix}${year}${id.toString().padStart(4, '0')}`;
    }

    static studentClassPrefixMap(student_class: StudentClassEnum): string {
        const data: Record<StudentClassEnum, string> = {
            [StudentClassEnum.TENDER_CARE]: 'Tender Care',
            [StudentClassEnum.JUMP_START]: 'Jump Start',
            [StudentClassEnum.PLAYGROUP]: 'Playgroup',
            [StudentClassEnum.NURSERY]: 'Nursery',
            [StudentClassEnum.JR_KG]: 'Junior KG',
            [StudentClassEnum.SR_KG]: 'Senior KG',
        }
        return data[student_class];
    }
}