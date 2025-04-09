GRANT SELECT ON TABLE public."Make" TO authenticated;
GRANT SELECT ON TABLE public."Model" TO authenticated;
GRANT SELECT ON TABLE public."VehicleType" TO authenticated;
GRANT SELECT ON TABLE public."Vehicle" TO authenticated;
GRANT SELECT ON TABLE public."Bid" TO authenticated;
GRANT SELECT ON TABLE public."_VehicleTypeMakes" TO authenticated;

GRANT INSERT ON TABLE public."Vehicle" TO authenticated;
GRANT UPDATE ON TABLE public."Vehicle" TO authenticated;
GRANT INSERT ON TABLE public."Bid" TO authenticated;
GRANT UPDATE ON TABLE public."Bid" TO authenticated;
GRANT SELECT ON TABLE public."Alert" TO authenticated;

GRANT INSERT ON TABLE public."CategorySubscription" TO authenticated;
GRANT UPDATE ON TABLE public."CategorySubscription" TO authenticated;
GRANT SELECT ON TABLE public."CategorySubscription" TO authenticated;


GRANT SELECT ON TABLE public."Vehicle" TO anon;




GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;