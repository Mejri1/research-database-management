CREATE OR REPLACE FUNCTION check_director_capacity()
RETURNS TRIGGER AS $$
DECLARE
    student_count INTEGER;
    doctoral_count INTEGER;
BEGIN
    IF NEW.grade = 'E' THEN
        SELECT COUNT(*) INTO student_count
        FROM chercheur
        WHERE supno = NEW.supno AND grade = 'E';
        
        IF student_count >= 30 THEN
            RAISE EXCEPTION 'Director has exceeded the capacity for supervising students of grade E (max 30)';
        END IF;
    ELSIF NEW.grade = 'D' THEN
        SELECT COUNT(*) INTO doctoral_count
        FROM chercheur
        WHERE supno = NEW.supno AND grade = 'D';
        
        IF doctoral_count >= 20 THEN
            RAISE EXCEPTION 'Director has exceeded the capacity for supervising doctoral students of grade D (max 20)';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_capacity_before_insert_update
BEFORE INSERT OR UPDATE ON chercheur
FOR EACH ROW EXECUTE FUNCTION check_director_capacity();
