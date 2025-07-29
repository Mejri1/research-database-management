CREATE OR REPLACE FUNCTION prevent_salary_decrease()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.salaire < OLD.salaire THEN
        RAISE EXCEPTION 'Salary decrease is not allowed for any researcher';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_salary_decrease
BEFORE UPDATE ON chercheur
FOR EACH ROW EXECUTE FUNCTION prevent_salary_decrease();
