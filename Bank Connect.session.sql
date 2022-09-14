
-- CREATE TABLE users(
--   firstname VARCHAR(254) NOT NULL,
--   lastname VARCHAR(254) NOT NULL,
--   email VARCHAR(254) NOT NULL UNIQUE PRIMARY KEY,
--   nationality VARCHAR(254) NOT NULL,
--   states VARCHAR(254) NOT NULL,
--   contact_address VARCHAR(254) NOT NULL,
--   PHONE VARCHAR(15)NOT NULL UNIQUE,
--   passwords VARCHAR(254) NOT NULL,
--   passcode INT(4) NOT NULL,
--   date_created DATETIME NOT NULL,
--   OTP VARCHAR(254),
--   updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
-- )

-- CREATE TABLE accounts(
--   ID INT AUTO_INCREMENT NOT NULL UNIQUE,
--   account_type ENUM('savings', 'current','dormicilliary') DEFAULT('savings') NOT NULL,
--   account_balance INT(19) NOT NULL DEFAULT(0000),
--   user VARCHAR(254) NOT NULL,
--   account_number INT(10) NOT NULL PRIMARY KEY,
--   date_created DATETIME NOT NULL,
--   FOREIGN KEY(user) REFERENCES users(email)
-- )

-- CREATE TABLE transactions(
--   ID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
--   sender INT NOT NULL,
--   receiver INT NOT NULL,
--   amount INT(19) NOT NULL,
--   statuss ENUM('pending', 'failed', 'successful'),
--   types ENUM('deposit', 'withdrawal', 'transfer'),
--   date_created DATETIME NOT NULL,
--   FOREIGN KEY(sender) REFERENCES accounts(account_number),
--   FOREIGN KEY(receiver) REFERENCES accounts(account_number)
-- )

-- SELECT * FROM users
-- WHERE email = 'gregudogu@gmail.com';

-- DESC users;

-- ALTER TABLE accounts
-- ADD COLUMN updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP;

-- SELECT users.firstname, users.lastname, account_number, account_balance
-- FROM accounts
-- INNER JOIN users
-- ON  accounts.user = users.email;

-- BEGIN TRY()
--   BEGIN TRANSACTION,
--     UPDATE accounts SET account_balance = account_balance + 10000 WHERE ID = 1,
--     UPDATE accounts SET account_balance = account_balance - 10000 WHERE ID = 2,
--     COMMIT TRANSACTION,
--     PRINT 'TRANSACTION SUCCESFUL'
-- END TRY
-- BEGIN CATCH
--   ROLLBACK TRANSACTION
--   PRINT 'TRANSACTION FAILED AND ROLLED BACK'
-- END CATCH

-- UPDATE accounts SET account_balance = account_balance + 5000 WHERE user ='gregudogu3@gmail.com';

-- ALTER TABLE transactions
-- MODIFY COLUMN date_created DATETIME NOT NULL DEFAULT(CURRENT_TIMESTAMP);

-- SELECT * FROM transactions;

-- SELECT users.passcode, account_number, account_balance
-- FROM accounts
-- INNER JOIN users
-- ON  accounts.user = users.email
-- WHERE user = 'gregudogu2@gmail.com';

SELECT * 
FROM transactions
INNER JOIN accounts;