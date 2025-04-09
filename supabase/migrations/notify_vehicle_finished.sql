CREATE OR REPLACE FUNCTION notify_vehicle_finished()
RETURNS TRIGGER AS $$
DECLARE
  bid_count INT;
  highest_bid FLOAT;
BEGIN
  -- Count the number of bids for the auction
  SELECT COUNT(*), MAX("amount") INTO bid_count, highest_bid
  FROM "Bid"
  WHERE "vehicleId" = NEW."id";

  -- Notify the seller
  IF bid_count > 0 THEN
    IF NEW."minPriceReq" IS NULL OR highest_bid >= NEW."minPriceReq" THEN
      -- If minPriceReq is NULL or the highest bid meets/exceeds the minimum price
      INSERT INTO "Alert" ("id", "userId", "message", "createdAt")
      VALUES (
        gen_random_uuid(), -- Generate a unique ID for the alert
        NEW."sellerId",
        CONCAT('Your auction for ', NEW."name", ' has finished. The item was sold for $', highest_bid, '.'),
        NOW()
      );
    ELSE
      -- If the highest bid is below the minimum price
      INSERT INTO "Alert" ("id", "userId", "message", "createdAt")
      VALUES (
        gen_random_uuid(), -- Generate a unique ID for the alert
        NEW."sellerId",
        CONCAT('Your auction for ', NEW."name", ' has finished. The item was not sold because the highest bid of $', highest_bid, ' did not meet the minimum price of $', NEW."minPriceReq", '.'),
        NOW()
      );
    END IF;
  ELSE
    -- If there are no bids
    INSERT INTO "Alert" ("id", "userId", "message", "createdAt")
    VALUES (
      gen_random_uuid(), -- Generate a unique ID for the alert
      NEW."sellerId",
      CONCAT('Your auction for ', NEW."name", ' has finished. The item was not sold because there were no bids.'),
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_notify_vehicle_finished
AFTER UPDATE OF "status" ON "Vehicle"
FOR EACH ROW
WHEN (NEW."status" = 'FINISH')
EXECUTE FUNCTION notify_vehicle_finished();