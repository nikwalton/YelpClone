-- Calculates earth distance in miles using the Haversine formula
CREATE OR REPLACE FUNCTION distance(x_lat numeric, x_long numeric,
                                    y_lat numeric, y_long numeric)
RETURNS numeric AS $$
   DECLARE
      earth_radius numeric := 3959;
      xlat numeric := x_lat * PI()/180;
      ylat numeric := y_lat * PI()/180;
      lat_diff numeric := (y_lat-x_lat) * PI()/180;
      lon_diff numeric := (y_long-x_long) * PI()/180;
      a numeric := SIN(lat_diff / 2) ^ 2 + COS(xlat) * COS(ylat) * SIN(lon_diff / 2) ^ 2;
      b numeric := SQRT(a);
      d numeric := 2 * ASIN(b) * earth_radius;
   BEGIN
      RETURN d;
   END;
$$ LANGUAGE plpgsql;