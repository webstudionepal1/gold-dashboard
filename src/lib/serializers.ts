/** Map Prisma records to legacy API shape with `_id` fields */

export function withMongoId<T extends { id: string }>(
  record: T
): T & { _id: string } {
  return { ...record, _id: record.id };
}

export function withMongoIds<T extends { id: string }>(records: T[]) {
  return records.map(withMongoId);
}

export function omitPassword<T extends { passwordHash?: string }>(user: T) {
  const { passwordHash: _, ...rest } = user;
  return rest;
}
