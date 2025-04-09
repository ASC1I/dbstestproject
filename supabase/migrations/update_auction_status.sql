CREATE OR REPLACE FUNCTION update_auction_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the auction's endTime has passed
  IF NEW."endTime" <= NOW() THEN
    -- Update the status to FINISH
    NEW."status" := 'FINISH';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_auction_status
BEFORE UPDATE OR INSERT ON "Vehicle"
FOR EACH ROW
EXECUTE FUNCTION update_auction_status();