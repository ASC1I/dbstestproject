-- Drop the existing foreign key constraint on the AutoBid table
ALTER TABLE public."AutoBid"
DROP CONSTRAINT "AutoBid_vehicleId_fkey";

-- Recreate the foreign key constraint with ON DELETE CASCADE
ALTER TABLE public."AutoBid"
ADD CONSTRAINT "AutoBid_vehicleId_fkey"
FOREIGN KEY ("vehicleId")
REFERENCES public."Vehicle" ("id")
ON DELETE CASCADE;

-- Drop the existing foreign key constraint on the Bid table
ALTER TABLE public."Bid"
DROP CONSTRAINT "Bid_vehicleId_fkey";

-- Recreate the foreign key constraint with ON DELETE CASCADE
ALTER TABLE public."Bid"
ADD CONSTRAINT "Bid_vehicleId_fkey"
FOREIGN KEY ("vehicleId")
REFERENCES public."Vehicle" ("id")
ON DELETE CASCADE;