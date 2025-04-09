CREATE OR REPLACE FUNCTION notify_auction_finished()
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
    INSERT INTO "Notification" ("userId", "message", "createdAt")
    VALUES (
      NEW."sellerId",
      CONCAT('Your auction for ', NEW."name", ' has finished. The item was sold for $', highest_bid, '.'),
      NOW()
    );
  ELSE
    INSERT INTO "Notification" ("userId", "message", "createdAt")
    VALUES (
      NEW."sellerId",
      CONCAT('Your auction for ', NEW."name", ' has finished. The item was not sold.'),
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_auction_finished
AFTER UPDATE OF "status" ON "Vehicle"
FOR EACH ROW
WHEN (NEW."status" = 'FINISH')
EXECUTE FUNCTION notify_auction_finished();