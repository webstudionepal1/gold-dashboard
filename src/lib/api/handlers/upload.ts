import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";
import { saveUploadedFile } from "@/lib/upload";

export async function handleUploadSingle(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  const documentType = (formData.get("documentType") as string) || "general";

  if (!(file instanceof File) || file.size === 0) {
    return apiError("No file provided", 400);
  }

  const url = await saveUploadedFile(file, documentType);
  const relativePath = url.replace(/^\//, "");

  return apiSuccess({
    path: relativePath,
    url,
  });
}

export async function handleUploadInitialize() {
  const uploadId = `local-${Date.now()}`;
  return apiSuccess({ uploadId, message: "Local upload ready" });
}

export async function handleUploadComplete(req: NextRequest, uploadId: string) {
  const formData = await req.formData();
  const file = formData.get("file");
  const documentType = (formData.get("documentType") as string) || "general";

  if (file instanceof File && file.size > 0) {
    const url = await saveUploadedFile(file, documentType);
    return apiSuccess({
      uploadId,
      filename: file.name,
      fileUrl: url,
      fileSize: file.size,
    });
  }

  return apiSuccess({ uploadId, status: "completed" });
}
