CREATE OR REPLACE FUNCTION update_vehicle_status_cron()
RETURNS VOID AS $$
BEGIN
  -- Update all active auctions where the endTime has passed
  UPDATE "Vehicle"
  SET "status" = 'FINISH'
  WHERE "status" = 'ACTIVE' AND "endTime" <= NOW();
END;
$$ LANGUAGE plpgsql;