CREATE DATABASE IF NOT EXISTS `pomodoro_app`;
USE `pomodoro_app`;

CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workTime INT NOT NULL,
    breakTime INT NOT NULL,
    longTime INT NOT NULL,
    currentCycle INT NOT NULL,
    active BOOLEAN NOT NULL,
    workCount INT NOT NULL
);

INSERT INTO settings (workTime, breakTime, longTime, currentCycle, active, workCount)
VALUES (1500, 300, 1200, 0, false, 0);
