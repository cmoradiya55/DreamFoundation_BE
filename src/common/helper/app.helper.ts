export class AppHelper {
    static generateRegNo(prefix: string, id: number): string {
        const year = new Date().getFullYear().toString();
        return `${prefix}${year}${id.toString().padStart(4, '0')}`;
    }
}