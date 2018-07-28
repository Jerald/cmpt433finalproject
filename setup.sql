-- CMPT 433 Project


CREATE TABLE Drinks (
  col_num integer NOT NULL CHECK (col_num >= 0 AND col_num <= 7),
  count integer NOT NULL CHECK (count >= 0),
  PRIMARY KEY(col_num)
);


CREATE TABLE Purchases (
  col_num integer CHECK (col_num >= 0 AND col_num <= 7),
  purchase_date timestamp default current_timestamp
);


INSERT INTO Drinks VALUES
  (0, 0), (1, 0), (2, 0), (3, 0), (4, 0), (5, 0), (6, 0), (7, 0);
