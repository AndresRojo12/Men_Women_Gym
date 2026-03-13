export function buildImageUrl(folder: string, filename: string): string {
  const baseUrl = (process.env.APP_URL || 'http://192.168.101.9:3000').replace(/\/$/, '');
  return `${baseUrl}/uploads/${folder}/${filename}`;
}