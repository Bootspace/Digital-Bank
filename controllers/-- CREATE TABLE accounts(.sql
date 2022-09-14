-- CREATE TABLE accounts(
--   ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
--   sender INT(11) NOT NULL,
--   receiver INT(11) NOT NULL,
--   amount DECIMAL(19,4) NOT NULL,
--   health ENUM('succesful','failed','pending'),
--   balance DECIMAL(19,4) NOT NULL,
--   FOREIGN KEY(sender) REFERENCES users(ID),
--   FOREIGN KEY(receiver) REFERENCES users(ID)
-- );

-- ALTER TABLE accounts
-- ADD created_at DATETIME
-- NOT NULL;

DESC accounts;