/**
 * Parse multipart field names like variant[0][price], makingCharges[type], tags[0]
 * into nested objects/arrays for API handlers.
 */
export function parseBracketFormData(
  flat: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, rawValue] of Object.entries(flat)) {
    if (!key.includes("[") && !key.includes("]")) {
      result[key] = rawValue;
      continue;
    }

    const path = key.replace(/\]/g, "").split("[");
    let current: unknown = result;

    for (let i = 0; i < path.length; i++) {
      const segment = path[i];
      const isLast = i === path.length - 1;
      const nextSegment = path[i + 1];
      const nextIsIndex = nextSegment !== undefined && /^\d+$/.test(nextSegment);

      if (isLast) {
        setAt(current, segment, rawValue);
        continue;
      }

      const existing = getAt(current, segment);
      if (existing === undefined) {
        setAt(current, segment, nextIsIndex ? [] : {});
      }
      current = getAt(current, segment);
    }
  }

  return result;
}

function getAt(container: unknown, key: string): unknown {
  if (Array.isArray(container)) {
    return container[Number(key)];
  }
  if (container && typeof container === "object") {
    return (container as Record<string, unknown>)[key];
  }
  return undefined;
}

function setAt(container: unknown, key: string, value: unknown) {
  if (Array.isArray(container)) {
    const idx = Number(key);
    while (container.length <= idx) {
      container.push({});
    }
    container[idx] = value;
    return;
  }
  if (container && typeof container === "object") {
    (container as Record<string, unknown>)[key] = value;
  }
}

export function coerceFormValue(value: unknown): unknown {
  if (value === "true") return true;
  if (value === "false") return false;
  if (typeof value === "string") {
    if (value.startsWith("[") || value.startsWith("{")) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    if (value !== "" && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return value;
}
