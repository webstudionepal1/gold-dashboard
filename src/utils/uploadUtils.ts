import Cookies from "js-cookie";

const getApiBase = () =>
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) ||
  "/api/v1/en/";

/**
 * Upload a single file to local Next.js storage (public/uploads)
 */
export const uploadFile = async (
  file: File,
  documentType: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);

  const response = await fetch(`${getApiBase()}enhanced-upload/single`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${Cookies.get("_UPLFMMATRIX") || ""}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data?.url || `/${result.data?.path}`;
};

/**
 * Upload multiple files
 */
export const uploadFiles = async (
  files: File[],
  documentType: string
): Promise<string[]> => {
  return Promise.all(files.map((file) => uploadFile(file, documentType)));
};
