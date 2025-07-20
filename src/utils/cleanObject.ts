export function cleanObject(obj: any): any {
  if (typeof obj !== "object" || obj === null) return obj;

  const cleaned: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(cleanObject(value)).length === 0)
    ) {
      continue;
    }

    if (Array.isArray(value)) {
      const cleanedArray = value
        .map((item) => (typeof item === "object" ? cleanObject(item) : item))
        .filter((item) =>
          typeof item === "object"
            ? Object.keys(item).length > 0
            : item !== null && item !== undefined && item !== ""
        );

      if (cleanedArray.length > 0) {
        cleaned[key] = cleanedArray;
      }
    } else if (typeof value === "object") {
      const cleanedObj = cleanObject(value);
      if (Object.keys(cleanedObj).length > 0) {
        cleaned[key] = cleanedObj;
      }
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}
