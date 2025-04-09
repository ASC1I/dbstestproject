CREATE OR REPLACE FUNCTION notify_bid_surpassed()
RETURNS TRIGGER AS $$
DECLARE
  previous_highest_bidder_id UUID;
BEGIN
  -- Find the previous highest bidder
  SELECT "userId"
  INTO previous_highest_bidder_id
  FROM "Bid"
  WHERE "vehicleId" = NEW."vehicleId"
  ORDER BY "amount" DESC
  LIMIT 1 OFFSET 1;

  -- Notify the previous highest bidder
  IF previous_highest_bidder_id IS NOT NULL THEN
    INSERT INTO "Notification" ("userId", "message", "createdAt")
    VALUES (
      previous_highest_bidder_id,
      CONCAT('Your bid on ', NEW."vehicleId", ' has been surpassed by another bidder.'),
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_bid_surpassed
AFTER INSERT ON "Bid"
FOR EACH ROW
EXECUTE FUNCTION notify_bid_surpassed();