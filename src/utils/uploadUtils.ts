import Cookies from "js-cookie";

/**
 * Upload a single file to the server
 * @param file - The file to upload
 * @param documentType - The type of document (e.g., 'collection-image', 'collection-banner', 'collection-video')
 * @returns Promise<string> - The full URL of the uploaded file
 */
export const uploadFile = async (
  file: File,
  documentType: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);

  const response = await fetch(
    `${import.meta.env.VITE_API_LOCAL_URL}enhanced-upload/single`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${Cookies.get("_UPLFMMATRIX") || ""}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const result = await response.json();

  // Construct full MinIO URL from the path
  const minioUrl = `${
    import.meta.env.VITE_MINIO_URL || "http://localhost:9000"
  }/${import.meta.env.VITE_MINIO_BUCKET || "hotel"}/${result.data.path}`;

  return minioUrl;
};

/**
 * Upload multiple files to the server
 * @param files - Array of files to upload
 * @param documentType - The type of document (e.g., 'collection-image')
 * @returns Promise<string[]> - Array of full URLs of the uploaded files
 */
export const uploadFiles = async (
  files: File[],
  documentType: string
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadFile(file, documentType));
  return Promise.all(uploadPromises);
};
