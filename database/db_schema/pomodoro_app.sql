CREATE DATABASE IF NOT EXISTS `pomodoro_app`;
USE `pomodoro_app`;

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(12) NOT NULL UNIQUE,
    `password` VARBINARY(128) NOT NULL,
    `salt`varchar(100) NOT NULL,
    PRIMARY KEY(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `Settings`;

CREATE TABLE `Settings` (
    `user_id` INTEGER NOT NULL,
    `work_time` INTEGER NOT NULL,
    `break_time` INTEGER NOT NULL,
    `long_time` INTEGER NOT NULL,
    `current_cycle` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL,
    `work_count` INTEGER NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `Settings` ADD FOREIGN KEY (user_id) REFERENCES `user_id` ON DELETE CASCADE ON UPDATE CASCADE;

/* Default values: id, 1500, 300, 1200, 0, false, 0 */
