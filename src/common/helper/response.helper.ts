
export class ResponseHelper {

    private static awsBaseUrl: string;

    static init(baseUrl: string) {
        this.awsBaseUrl = baseUrl;
    }

    static buildImageUrl(key?: string | null): string | null {
        if (!key) return null;

        if (/^https?:\/\//i.test(key)) {
            return key;
        }
        return `${this.awsBaseUrl}/${key}`;
    }
}