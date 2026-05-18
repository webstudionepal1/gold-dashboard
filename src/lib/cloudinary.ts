import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function getCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env"
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return cloudinary;
}

function isVideoMime(mime: string): boolean {
  return mime.startsWith("video/");
}

/**
 * Upload a File to Cloudinary. Returns the secure HTTPS URL to store in the database.
 */
export async function uploadFileToCloudinary(
  file: File,
  folder: string
): Promise<string> {
  const cloud = getCloudinary();
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadFolder = `panch/${folder}`.replace(/\/+/g, "/");

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloud.uploader.upload_stream(
      {
        folder: uploadFolder,
        resource_type: isVideoMime(file.type) ? "video" : "auto",
        use_filename: true,
        unique_filename: true,
      },
      (error, uploadResult) => {
        if (error) reject(error);
        else if (!uploadResult?.secure_url) {
          reject(new Error("Cloudinary upload returned no URL"));
        } else {
          resolve({ secure_url: uploadResult.secure_url });
        }
      }
    );
    stream.end(buffer);
  });

  return result.secure_url;
}

/** Build a Cloudinary delivery URL from a public_id (optional transforms). */
export function cloudinaryDeliveryUrl(
  publicId: string,
  options?: { width?: number; height?: number; crop?: string }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return publicId;

  const transforms: string[] = [];
  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);
  const transform = transforms.length ? `${transforms.join(",")}/` : "";

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}${publicId}`;
}

export function isCloudinaryUrl(url: string): boolean {
  return /res\.cloudinary\.com/i.test(url);
}
