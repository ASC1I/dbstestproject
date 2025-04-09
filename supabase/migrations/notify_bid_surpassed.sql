CREATE OR REPLACE FUNCTION notify_bid_surpassed()
RETURNS TRIGGER AS $$
DECLARE
  previous_highest_bidder_id UUID;
  vehicle_name TEXT;
BEGIN
  -- Get the name of the vehicle
  SELECT "name"
  INTO vehicle_name
  FROM "Vehicle"
  WHERE "id" = NEW."vehicleId";

  -- Find the previous highest bidder
  SELECT "userId"
  INTO previous_highest_bidder_id
  FROM "Bid"
  WHERE "vehicleId" = NEW."vehicleId"
  ORDER BY "amount" DESC
  LIMIT 1 OFFSET 1;

  -- Notify the previous highest bidder
  IF previous_highest_bidder_id IS NOT NULL THEN
    INSERT INTO "Alert" ("id", "userId", "message", "createdAt")
    VALUES (
      gen_random_uuid(), -- Generate a unique ID for the alert
      previous_highest_bidder_id,
      CONCAT('Your bid on "', vehicle_name, '" has been surpassed by another bidder.'),
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_notify_bid_surpassed
AFTER INSERT ON "Bid"
FOR EACH ROW
EXECUTE FUNCTION notify_bid_surpassed();