CREATE OR REPLACE FUNCTION notify_new_vehicle()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notifications for all users subscribed to the category
  INSERT INTO "Notification" ("userId", "message", "createdAt")
  SELECT "userId", 
         CONCAT('A new item has been added to your subscribed category: ', NEW."name"),
         NOW()
  FROM "CategorySubscription"
  WHERE "vehicleTypeId" = NEW."vehicleTypeId";

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_vehicle
AFTER INSERT ON "Vehicle"
FOR EACH ROW
EXECUTE FUNCTION notify_new_vehicle();