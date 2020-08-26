CREATE TABLE PUBLIC.SHARE_TABLE (
	ID INTEGER NOT NULL AUTO_INCREMENT,
	"DATE" DATE NOT NULL,
	COMPANY VARCHAR(255) NOT NULL,
	COST DECIMAL(65535,32767) NOT NULL,
	CONSTRAINT CONSTRAINT_C PRIMARY KEY (ID)
);
CREATE UNIQUE INDEX PRIMARY_KEY_C ON PUBLIC.SHARE_TABLE (ID);