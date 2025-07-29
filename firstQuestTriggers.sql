-- Trigger for BEFORE UPDATE
CREATE OR REPLACE FUNCTION save_chercheur_history_before_update()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO historique_chercheurs (chno, chnom, grade, statut, daterecrut, salaire, prime, email, supno, labno, facno, action_type, action_date)
    VALUES (OLD.chno, OLD.chnom, OLD.grade, OLD.statut, OLD.daterecrut, OLD.salaire, OLD.prime, OLD.email, OLD.supno, OLD.labno, OLD.facno, 'UPDATE', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_chercheur_update
BEFORE UPDATE ON chercheur
FOR EACH ROW EXECUTE FUNCTION save_chercheur_history_before_update();

-- Trigger for BEFORE DELETE
CREATE OR REPLACE FUNCTION save_chercheur_history_before_delete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO historique_chercheurs (chno, chnom, grade, statut, daterecrut, salaire, prime, email, supno, labno, facno, action_type, action_date)
    VALUES (OLD.chno, OLD.chnom, OLD.grade, OLD.statut, OLD.daterecrut, OLD.salaire, OLD.prime, OLD.email, OLD.supno, OLD.labno, OLD.facno, 'DELETE', NOW());
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_chercheur_delete
BEFORE DELETE ON chercheur
FOR EACH ROW EXECUTE FUNCTION save_chercheur_history_before_delete();
