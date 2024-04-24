ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'technical_test';
CREATE USER 'technical_test'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'technical_test';
GRANT ALL PRIVILEGES ON *.* TO 'technical_test'@'localhost';
FLUSH PRIVILEGES;
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

