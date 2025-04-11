CREATE OR REPLACE FUNCTION handle_auto_bidding()
RETURNS TRIGGER AS $$
DECLARE
  auto_bidder RECORD;
  new_bid_amount FLOAT;
BEGIN
  -- Find the next eligible auto-bidder
  SELECT *
  INTO auto_bidder
  FROM "AutoBid"
  WHERE "vehicleId" = NEW."vehicleId"
    AND "upperLimit" >= (NEW."amount" + (SELECT "bidIncrement" FROM "Vehicle" WHERE "id" = NEW."vehicleId"))
    AND "userId" != NEW."userId"
  ORDER BY "upperLimit" DESC, "createdAt" ASC
  LIMIT 1;

  -- If an eligible auto-bidder is found, place their bid
  IF auto_bidder IS NOT NULL THEN
    new_bid_amount := NEW."amount" + (SELECT "bidIncrement" FROM "Vehicle" WHERE "id" = NEW."vehicleId");

    -- Ensure the new bid does not exceed the auto-bidder's upper limit
    IF new_bid_amount > auto_bidder."upperLimit" THEN
      new_bid_amount := auto_bidder."upperLimit";
    END IF;

    -- Insert the new automatic bid
    INSERT INTO "Bid" ("id", "vehicleId", "userId", "amount", "createdAt")
    VALUES (
      gen_random_uuid(),
      NEW."vehicleId",
      auto_bidder."userId",
      new_bid_amount,
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_bidding
AFTER INSERT ON "Bid"
FOR EACH ROW
EXECUTE FUNCTION handle_auto_bidding();