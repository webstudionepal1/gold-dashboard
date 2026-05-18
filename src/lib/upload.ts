import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { isCloudinaryConfigured, uploadFileToCloudinary } from "@/lib/cloudinary";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

/** Save file to Cloudinary (preferred) or local public/uploads when Cloudinary is not configured. */
export async function saveUploadedFile(
  file: File,
  documentType: string
): Promise<string> {
  const folder = sanitizeFolder(documentType);

  if (isCloudinaryConfigured()) {
    return uploadFileToCloudinary(file, folder);
  }

  return saveUploadedFileLocal(file, folder);
}

async function saveUploadedFileLocal(
  file: File,
  folder: string
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || guessExt(file.type);
  const filename = `${randomUUID()}${ext}`;
  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });

  const fullPath = path.join(dir, filename);
  await writeFile(fullPath, buffer);

  return `/uploads/${folder}/${filename}`;
}

export async function saveUploadedFiles(
  files: File[],
  documentType: string
): Promise<string[]> {
  return Promise.all(files.map((f) => saveUploadedFile(f, documentType)));
}

function sanitizeFolder(name: string) {
  return name.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase() || "general";
}

function guessExt(mime: string) {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "application/pdf": ".pdf",
  };
  return map[mime] || "";
}

export async function parseFormDataFiles(
  formData: FormData,
  fieldNames: string[]
): Promise<Record<string, string | string[]>> {
  const result: Record<string, string | string[]> = {};

  for (const field of fieldNames) {
    const entries = formData.getAll(field);
    const files = entries.filter((e): e is File => e instanceof File && e.size > 0);
    if (files.length === 0) continue;

    const docType = (formData.get("documentType") as string) || field;
    const urls = await saveUploadedFiles(files, docType);

    if (files.length === 1) {
      result[field] = urls[0];
    } else {
      result[field] = urls;
    }
  }

  return result;
}

export function parseJsonField<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (!value || typeof value !== "string") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
