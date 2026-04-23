-- Create a dedicated test database so integration tests don't pollute dev.
CREATE DATABASE IF NOT EXISTS piramid_test
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON piramid.* TO 'piramid'@'%';
GRANT ALL PRIVILEGES ON piramid_test.* TO 'piramid'@'%';
FLUSH PRIVILEGES;
