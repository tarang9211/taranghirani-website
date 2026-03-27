import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function extractPublicId(url: string): string {
  // Matches: /upload/v123456/ or /upload/ then captures the rest without extension
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
  return match ? match[1] : "";
}

export async function getImageExif(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId, {
      image_metadata: true,
    });
    const m = result.image_metadata || {};
    return {
      aperture: m.FNumber || null,
      shutterSpeed: m.ExposureTime || null,
      iso: m.ISO || null,
    };
  } catch {
    return null;
  }
}

export default cloudinary;
