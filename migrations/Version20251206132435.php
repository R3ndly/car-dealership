<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251206132435 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create users and roles tables for authentication and registration';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE roles(
                role_id SMALLSERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL UNIQUE
            )
        ');
        $this->addSql("INSERT INTO roles(title) VALUES('user'), ('moderator'), ('admin')");

        $this->addSql('
            CREATE TABLE users(
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role_id smallint NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT user_id_to_role_id
                        FOREIGN KEY (role_id)
                        REFERENCES roles(role_id)
                        ON DELETE SET DEFAULT
                        ON UPDATE CASCADE
            )
        ');
        $this->addSql('CREATE INDEX index_users_username ON users(username)');
        $this->addSql('CREATE INDEX index_users_role_id ON users(role_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE users');
        $this->addSql('DROP TABLE roles');
    }
}
