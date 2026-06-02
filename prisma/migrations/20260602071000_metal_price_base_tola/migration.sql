-- Add base-per-tola inputs + purity mapping for metal prices
ALTER TABLE "MetalPrice"
ADD COLUMN     "baseGold999PerTola" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "baseSilverPerTola" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "tolaGrams" DOUBLE PRECISION NOT NULL DEFAULT 11.664,
ADD COLUMN     "purityConfig" JSONB NOT NULL DEFAULT '{"24":99.9,"22":91.6,"18":75,"14":58.3,"10":41.7}';

-- If you have existing rows, backfill base rates from the legacy perGram JSON.
-- This keeps "latest" records consistent without requiring manual re-entry.
UPDATE "MetalPrice"
SET
  "baseGold999PerTola" = COALESCE( ("gold"->>'perGram')::double precision, 0) * "tolaGrams",
  "baseSilverPerTola"  = COALESCE( ("silver"->>'perGram')::double precision, 0) * "tolaGrams"
WHERE
  ("baseGold999PerTola" = 0 OR "baseGold999PerTola" IS NULL)
  OR ("baseSilverPerTola" = 0 OR "baseSilverPerTola" IS NULL);

