-- CMPT 433 Project


CREATE TABLE Drinks (
  col_num integer NOT NULL CHECK (col_num >= 1 AND col_num <= 8),
  count integer NOT NULL CHECK (count >= 0),
  PRIMARY KEY(col_num)
);


CREATE TABLE Purchases (
  col_num integer CHECK (col_num >= 1 AND col_num <=8),
  purchase_date timestamp
);



CREATE FUNCTION update_purchase_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    NEW.purchase_date = NOW();
    RETURN NEW;
  END;
$$;

CREATE TRIGGER t1_purchase BEFORE UPDATE ON Purchases FOR EACH ROW EXECUTE PROCEDURE update_purchase_timestamp();


INSERT INTO Drinks VALUES
  (1, 0), (2, 0), (3, 0), (4, 0), (5, 0), (6, 0), (7, 0), (8, 0);
