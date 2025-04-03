-- Update all existing apps to be public
UPDATE "apps" SET "is_public" = TRUE WHERE "is_public" = FALSE;