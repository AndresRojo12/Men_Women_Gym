export function buildImageUrl(folder: string, filename: string): string {
    const baseUrl = process.env.APP_URL|| 'http://localhost:3000';
    return `${baseUrl}/uploads/${folder}/${filename}`;
}