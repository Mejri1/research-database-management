CREATE OR REPLACE FUNCTION restrict_updates_to_working_hours()
RETURNS TRIGGER AS $$
DECLARE
    current_time TIME := LOCALTIME;
    current_day INT := EXTRACT(ISODOW FROM CURRENT_DATE);
BEGIN
    IF current_day IN (6, 7) OR current_time < TIME '08:00' OR current_time > TIME '18:00' THEN
        RAISE EXCEPTION 'Updates are only allowed during working hours (Monday to Friday, 8 AM - 6 PM)';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply this trigger to each table requiring update restrictions
CREATE TRIGGER restrict_updates_chercheur
BEFORE INSERT OR UPDATE ON chercheur
FOR EACH ROW EXECUTE FUNCTION restrict_updates_to_working_hours();
