ALTER TABLE `tbl_company` ADD `connectAD` INT(1) NOT NULL DEFAULT '0' COMMENT 'Connect to Active Directory' AFTER `assFilterBehaviour`;
ALTER TABLE `tbl_company` ADD `defCourseDuration` INT(3) NOT NULL DEFAULT '30' COMMENT 'Default number of days for course completion' AFTER `connectAD`;
ALTER TABLE `tbl_company` ADD `reminderInterval` INT(3) NOT NULL DEFAULT '7' COMMENT 'Global reminder interval for mail reminders (0 => no reminders)' AFTER `defCourseDuration`;
ALTER TABLE `tbl_company` ADD `reminderDay` INT(2) NOT NULL DEFAULT '0' COMMENT 'Day for sending mail reminder (weekly: 0 => Mo, ..., 7 => Su, otherwise: day of month)' AFTER `reminderInterval`;
ALTER TABLE `tbl_company` ADD `licenseUntil` DATE NULL COMMENT 'License expiration date' AFTER `reminderDay`;
ALTER TABLE `tbl_company` ADD `showAllCourses` INT(1) NOT NULL DEFAULT '1' COMMENT 'Indicates whether department/group admins are allowed to assign all courses or just courses assigned as view/edit.' AFTER `assFilterBehaviour`;

CREATE TABLE `tbl_course_rights` ( `courseRightId` INT NOT NULL AUTO_INCREMENT COMMENT 'Primary key' , `courseId` INT NOT NULL COMMENT 'Course ID' , `userId` INT NOT NULL COMMENT 'User ID' , `permission` INT NOT NULL COMMENT '1 => view, 2 => edit' , PRIMARY KEY (`courseRightId`)) ENGINE = InnoDB;

ALTER TABLE `tbl_user` ADD `inactive` INT(1) NOT NULL DEFAULT '0' COMMENT '0 => active, 1 => inactive by AD, 2 => inactive by system' AFTER `dateTimeCreated`;
ALTER TABLE `tbl_user` ADD `ADUser` INT(1) NOT NULL DEFAULT '0' COMMENT '	0 => standard user, 1 => AD imported user' AFTER `inactive`;
ALTER TABLE `tbl_user` ADD `ADUID` VARCHAR(50) NULL DEFAULT NULL COMMENT 'UID for active directory' AFTER `ADUser`;
ALTER TABLE `tbl_user` ADD `activeUntil` DATE NULL DEFAULT NULL COMMENT 'If set => account is deactivated after specified date.' AFTER `inactive`;
ALTER TABLE `tbl_user` ADD `deactivateMail` INT(1) NOT NULL DEFAULT '0' COMMENT '1 => do not send mail reminder' AFTER `ADUID`;

ALTER TABLE `tbl_course` ADD `useDefaultCertificate` INT(1) NOT NULL DEFAULT '0' AFTER `isClosed`;

ALTER TABLE `tbl_user_department` ADD `isADAssignment` INT(1) NOT NULL DEFAULT '0' COMMENT 'Set to 1 if assigned via Active Directory' AFTER `dateAssigned`;

ALTER TABLE `tbl_user_group` ADD `isADAssignment` INT(1) NOT NULL DEFAULT '0' COMMENT 'Set to 1 if assigned via Active Directory' AFTER `dateAssigned`;
