CREATE OR REPLACE FUNCTION get_sales_report()
RETURNS TABLE (
  total_earnings NUMERIC,
  earnings_by_vehicle_type JSONB,
  earnings_by_make JSONB,
  best_buyer JSONB,
  best_selling_item JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Total earnings (cast to NUMERIC)
    (SELECT COALESCE(SUM("currentPrice")::NUMERIC, 0) FROM public."Vehicle" WHERE status = 'FINISH') AS total_earnings,

    -- Earnings by Vehicle Type (cast sums to NUMERIC)
    (SELECT JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'vehicle_type', subquery.name,
        'earnings', subquery.earnings::NUMERIC
      )
    )
    FROM (
      SELECT vt.name, SUM(v."currentPrice")::NUMERIC AS earnings
      FROM public."Vehicle" v
      JOIN public."VehicleType" vt ON v."vehicleTypeId" = vt.id
      WHERE v.status = 'FINISH'
      GROUP BY vt.name
    ) subquery) AS earnings_by_vehicle_type,

    -- Earnings by Make (cast sums to NUMERIC)
    (SELECT JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'make', subquery.name,
        'earnings', subquery.earnings::NUMERIC
      )
    )
    FROM (
      SELECT m.name, SUM(v."currentPrice")::NUMERIC AS earnings
      FROM public."Vehicle" v
      JOIN public."Make" m ON v."makeId" = m.id
      WHERE v.status = 'FINISH'
      GROUP BY m.name
    ) subquery) AS earnings_by_make,

    -- Best Buyer (cast amount to NUMERIC)
    (SELECT JSONB_BUILD_OBJECT(
      'buyer_email', subquery.email,
      'total_spent', subquery.total_spent::NUMERIC
    )
    FROM (
      SELECT p.email, SUM(b.amount)::NUMERIC AS total_spent
      FROM public."Bid" b
      JOIN public."Profile" p ON b."userId" = p.id
      JOIN public."Vehicle" v ON b."vehicleId" = v.id
      WHERE v.status = 'FINISH' 
        AND b.amount = v."currentPrice" -- Only count the winning bid
      GROUP BY p.email
      ORDER BY SUM(b.amount) DESC
      LIMIT 1
    ) subquery) AS best_buyer,

    -- Best-Selling Item (cast price to NUMERIC)
    (SELECT JSONB_BUILD_OBJECT(
      'vehicle_name', v.name,
      'sale_price', v."currentPrice"::NUMERIC,
      'make', m.name,
      'model', mo.name
    )
    FROM public."Vehicle" v
    JOIN public."Make" m ON v."makeId" = m.id
    JOIN public."Model" mo ON v."modelId" = mo.id
    WHERE v.status = 'FINISH'
    ORDER BY v."currentPrice" DESC
    LIMIT 1) AS best_selling_item;
END;
$$ LANGUAGE plpgsql;