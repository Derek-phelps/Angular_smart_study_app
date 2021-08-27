-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 29, 2020 at 04:35 PM
-- Server version: 5.7.31-34-log
-- PHP Version: 7.0.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_jr_smart_study`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_certificater`
--

CREATE TABLE `tbl_certificater` (
  `certificaterId` int(11) NOT NULL,
  `CertificateName` varchar(100) DEFAULT NULL,
  `CertificateTitle` varchar(1000) DEFAULT NULL,
  `companyId` int(11) NOT NULL DEFAULT '0',
  `Course` int(11) NOT NULL,
  `imgPath` varchar(100) NOT NULL,
  `SignatureimgPath` varchar(500) NOT NULL,
  `createdBy` int(11) NOT NULL,
  `companyLogo` varchar(300) NOT NULL,
  `coursePlease` varchar(500) NOT NULL,
  `bossTitleName` varchar(200) NOT NULL,
  `bossPosition` varchar(200) NOT NULL,
  `createdCmpId` int(11) NOT NULL,
  `title_x_y` varchar(200) NOT NULL,
  `date_x_y` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_certificate_link`
--

CREATE TABLE `tbl_certificate_link` (
  `certificateLinkId` varchar(20) NOT NULL COMMENT 'Certificate link ID',
  `courseId` int(11) NOT NULL COMMENT 'Course ID',
  `companyId` int(11) NOT NULL COMMENT 'Company ID',
  `isPublic` int(1) NOT NULL DEFAULT '0' COMMENT '0 => Link just accessible with Smart-Study account',
  `getAll` int(1) NOT NULL DEFAULT '0' COMMENT '1 => Get employee ids from tbl_emp_certi',
  `validUntil` datetime NOT NULL COMMENT 'Expiry date time for link',
  `password` varchar(45) DEFAULT NULL COMMENT 'Password for external access'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_chapter`
--

CREATE TABLE `tbl_chapter` (
  `chapterId` int(11) NOT NULL,
  `parentChapterId` int(11) DEFAULT NULL,
  `chapterName` varchar(500) DEFAULT NULL,
  `courseId` int(45) DEFAULT NULL,
  `Ch_index` int(11) NOT NULL DEFAULT '1',
  `is_offline` int(1) NOT NULL DEFAULT '0' COMMENT '0 is offline, 1 is online, 2 is SCORM',
  `scormPath` varchar(100) NOT NULL DEFAULT '404' COMMENT 'Path to file in scorm folder on server'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_ci_sessions`
--

CREATE TABLE `tbl_ci_sessions` (
  `id` varchar(128) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `timestamp` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `data` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_comment`
--

CREATE TABLE `tbl_comment` (
  `commentId` int(11) NOT NULL,
  `newsFeedId` int(11) NOT NULL,
  `comment` text NOT NULL,
  `DateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `empId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_company`
--

CREATE TABLE `tbl_company` (
  `companyId` int(11) NOT NULL,
  `companyName` varchar(200) NOT NULL,
  `companyLogo` varchar(200) NOT NULL,
  `companyRegNo` varchar(100) NOT NULL,
  `NumOfEmp` int(11) NOT NULL,
  `compUrl` varchar(300) NOT NULL,
  `webUrl` varchar(300) NOT NULL,
  `baner` varchar(200) NOT NULL,
  `bannerColor` varchar(7) NOT NULL DEFAULT '#ffffff',
  `BackgroundImage` varchar(200) NOT NULL,
  `createdBy` int(11) NOT NULL,
  `defaultLang` varchar(10) NOT NULL DEFAULT 'en' COMMENT 'Default language for company login and new users.',
  `assFilterBehaviour` varchar(10) NOT NULL DEFAULT 'shortest' COMMENT 'Course assignment filter value',
  `showAllCourses` int(1) NOT NULL DEFAULT '1' COMMENT 'Indicates whether department/group admins are allowed to assign all courses or just courses assigned as view/edit.',
  `connectAD` int(1) NOT NULL DEFAULT '0' COMMENT 'Connect to Active Directory',
  `defCourseDuration` int(3) NOT NULL DEFAULT '30' COMMENT 'Default number of days for course completion',
  `reminderInterval` int(3) NOT NULL DEFAULT '7' COMMENT 'Global reminder interval for mail reminders (0 => no reminders)',
  `reminderDay` int(2) NOT NULL DEFAULT '0' COMMENT 'Day for sending mail reminder (weekly: 0 => Mo, ..., 7 => Su, otherwise: day of month)',
  `licenseUntil` date DEFAULT NULL COMMENT 'License expiration date'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_company`
--

INSERT INTO `tbl_company` (`companyId`, `companyName`, `companyLogo`, `companyRegNo`, `NumOfEmp`, `compUrl`, `webUrl`, `baner`, `bannerColor`, `BackgroundImage`, `createdBy`, `defaultLang`, `assFilterBehaviour`, `showAllCourses`, `connectAD`, `defCourseDuration`, `reminderInterval`, `reminderDay`, `licenseUntil`) VALUES
(1, 'Demo Company', '', '', 5000, '', 'develop-daniel', '', '#ffffff', '', 0, 'de', 'shortest', 1, 0, 30, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_course`
--

CREATE TABLE `tbl_course` (
  `courseId` int(11) NOT NULL,
  `courseName` varchar(100) DEFAULT NULL,
  `courseImg` varchar(100) DEFAULT NULL,
  `courseRate` int(11) DEFAULT NULL,
  `courseDes` text,
  `createdBy` int(11) NOT NULL,
  `departmentId` varchar(50) NOT NULL,
  `EndTime` varchar(200) NOT NULL,
  `minResult` int(11) NOT NULL,
  `duration` int(11) NOT NULL DEFAULT '0',
  `companyId` int(11) NOT NULL,
  `startDate` varchar(100) NOT NULL,
  `isOffine` int(1) NOT NULL DEFAULT '0',
  `trainerId` int(11) NOT NULL,
  `classPlace` varchar(300) NOT NULL,
  `isCopy` int(11) NOT NULL DEFAULT '1',
  `isScormCourse` int(1) NOT NULL DEFAULT '0',
  `scormPath` varchar(100) NOT NULL DEFAULT '404' COMMENT 'path to scorm folder on server',
  `locationId` int(11) NOT NULL,
  `isLocReq` int(11) NOT NULL,
  `isClosed` int(1) NOT NULL DEFAULT '0' COMMENT 'Marks the course as closed by admin/trainer',
  `useDefaultCertificate` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_course_assignment`
--

CREATE TABLE `tbl_course_assignment` (
  `courseAssId` int(11) NOT NULL COMMENT 'Primary key',
  `courseId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `groupId` int(11) DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `applyToSubDeps` int(1) NOT NULL DEFAULT '0' COMMENT 'Indicates whether to apply the assignment also for child departments (only for department assignments)',
  `companyId` int(11) DEFAULT NULL,
  `mandatory` int(1) NOT NULL,
  `startDate` date NOT NULL,
  `timeToComplete` int(11) NOT NULL COMMENT 'Time to complete the course in days',
  `isSeries` int(1) NOT NULL DEFAULT '0' COMMENT 'Course assigned as course series',
  `repeatSpan` int(11) DEFAULT NULL COMMENT 'Repeat every X time units',
  `repeatUnit` varchar(10) DEFAULT NULL COMMENT 'Define repeating time unit (months/years)',
  `endDate` date DEFAULT NULL COMMENT 'Defines end date for course series',
  `catchUp` int(1) NOT NULL DEFAULT '0' COMMENT 'If group assignment => 1 if user has to complete course immediately',
  `forceSeries` int(1) NOT NULL DEFAULT '0' COMMENT 'Indicates whether to force the direct series assignment.'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_course_rights`
--

CREATE TABLE `tbl_course_rights` (
  `courseRightId` int(11) NOT NULL COMMENT 'Primary key',
  `courseId` int(11) NOT NULL COMMENT 'Course ID',
  `userId` int(11) NOT NULL COMMENT 'User ID',
  `permission` int(11) NOT NULL COMMENT '1 => view, 2 => edit'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_department`
--

CREATE TABLE `tbl_department` (
  `departmentId` int(11) NOT NULL,
  `parentDepId` int(11) DEFAULT NULL COMMENT 'Id of parent department',
  `departmentName` varchar(200) NOT NULL,
  `companyId` int(11) NOT NULL,
  `dep_heapId` int(11) NOT NULL,
  `createdBy` int(11) NOT NULL,
  `logo` varchar(200) NOT NULL,
  `background` varchar(200) NOT NULL,
  `banner` varchar(200) NOT NULL,
  `depPassword` varchar(500) NOT NULL,
  `cretedCompanyID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_employeess`
--

CREATE TABLE `tbl_employeess` (
  `empId` int(11) NOT NULL,
  `positionId` int(45) DEFAULT '0',
  `empCompId` int(45) DEFAULT NULL,
  `empEdu` varchar(100) DEFAULT NULL,
  `epath` varchar(200) NOT NULL,
  `FULLNAME` varchar(200) NOT NULL COMMENT 'Full name (for certificate)',
  `FIRSTNAME` varchar(200) NOT NULL,
  `LASTNAME` varchar(100) NOT NULL,
  `GENDER` varchar(100) NOT NULL,
  `MOBILEPHONE` varchar(100) NOT NULL,
  `CURRENTADDRESS` varchar(1000) NOT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `token` text NOT NULL,
  `createdByCompany` int(11) NOT NULL,
  `workgroupId` int(11) DEFAULT NULL,
  `staffNumber` varchar(100) NOT NULL COMMENT 'Staff number'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_employeess`
--

INSERT INTO `tbl_employeess` (`empId`, `positionId`, `empCompId`, `empEdu`, `epath`, `FULLNAME`, `FIRSTNAME`, `LASTNAME`, `GENDER`, `MOBILEPHONE`, `CURRENTADDRESS`, `departmentId`, `token`, `createdByCompany`, `workgroupId`, `staffNumber`) VALUES
(1, 0, 1, '', '', 'Dr. Vorname Nachname', 'Vorname', 'Nachname', 'Male', '', '', NULL, '', 1, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_emp_certi`
--

CREATE TABLE `tbl_emp_certi` (
  `empCertiId` int(11) NOT NULL,
  `certificateLinkId` varchar(20) NOT NULL,
  `empId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_emp_course`
--

CREATE TABLE `tbl_emp_course` (
  `emp_courseId` int(11) NOT NULL,
  `courseId` int(11) DEFAULT NULL,
  `empId` int(11) DEFAULT NULL,
  `isCompleted` tinyint(1) NOT NULL DEFAULT '0',
  `justPass` int(1) NOT NULL DEFAULT '0' COMMENT 'Marks if it just passed by admin (no certificate)',
  `companyId` int(11) NOT NULL,
  `finalResult` float NOT NULL DEFAULT '0',
  `dateFinished` datetime DEFAULT NULL COMMENT 'Date and time when employee finished the course',
  `createdByDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) NOT NULL,
  `startDate` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_emp_scormChapter`
--

CREATE TABLE `tbl_emp_scormChapter` (
  `emp_scormChapterId` int(11) NOT NULL,
  `emp_courseId` int(11) NOT NULL,
  `chapterId` int(11) NOT NULL,
  `scormInfo` varchar(10000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_emp_subChap`
--

CREATE TABLE `tbl_emp_subChap` (
  `empSubChapId` int(11) NOT NULL,
  `SubChapId` int(11) NOT NULL,
  `emp_courseId` int(11) NOT NULL,
  `isComplite` int(11) NOT NULL DEFAULT '0',
  `markAttendance` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_feed`
--

CREATE TABLE `tbl_feed` (
  `feedId` int(11) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `Message` text NOT NULL,
  `empId` int(11) NOT NULL,
  `companyId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_group`
--

CREATE TABLE `tbl_group` (
  `groupId` int(11) NOT NULL COMMENT 'Group ID',
  `name` varchar(100) NOT NULL COMMENT 'Group Name',
  `companyId` int(11) NOT NULL COMMENT 'Company ID',
  `createdBy` int(11) NOT NULL COMMENT 'Created by user ID',
  `color` varchar(7) NOT NULL DEFAULT '#ffffff' COMMENT 'Group color',
  `departmentId` int(11) DEFAULT NULL COMMENT 'Set if linked to department'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_group_category`
--

CREATE TABLE `tbl_group_category` (
  `categoryId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL COMMENT 'Category name',
  `companyId` int(11) NOT NULL COMMENT 'Company ID',
  `createdBy` int(11) NOT NULL COMMENT 'Created by user ID',
  `color` varchar(7) NOT NULL DEFAULT '#ffffff' COMMENT 'Category color'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_group_category_assignment`
--

CREATE TABLE `tbl_group_category_assignment` (
  `gcaId` int(11) NOT NULL COMMENT 'Primary key',
  `groupId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_group_rights`
--

CREATE TABLE `tbl_group_rights` (
  `groupRightId` int(11) NOT NULL COMMENT 'Primary key',
  `groupId` int(11) NOT NULL COMMENT 'Group ID',
  `userId` int(11) NOT NULL COMMENT 'User ID',
  `permission` int(1) NOT NULL COMMENT '1 => view, 2 => edit'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_likeComments`
--

CREATE TABLE `tbl_likeComments` (
  `commentLikeid` int(11) NOT NULL,
  `commentId` int(11) NOT NULL,
  `empId` int(11) NOT NULL,
  `DateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_likeNewsfeed`
--

CREATE TABLE `tbl_likeNewsfeed` (
  `likeNewsId` int(11) NOT NULL,
  `newsFeedId` int(11) NOT NULL,
  `empId` int(11) NOT NULL,
  `dateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_location`
--

CREATE TABLE `tbl_location` (
  `locationId` int(11) NOT NULL,
  `companyId` int(11) NOT NULL,
  `locationName` text NOT NULL,
  `createdBy` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_message`
--

CREATE TABLE `tbl_message` (
  `messageId` int(11) NOT NULL,
  `messageSub` varchar(100) DEFAULT NULL,
  `message` varchar(1000) DEFAULT NULL,
  `senderId` int(45) DEFAULT NULL,
  `resiverId` int(45) DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_newsfeed`
--

CREATE TABLE `tbl_newsfeed` (
  `newsfeedId` int(11) NOT NULL,
  `feedImg` varchar(100) NOT NULL,
  `filePath` varchar(200) NOT NULL,
  `newsfeed` text NOT NULL,
  `postTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `empId` int(11) NOT NULL,
  `companyId` int(11) NOT NULL DEFAULT '0',
  `courseId` int(11) NOT NULL DEFAULT '0',
  `ForbidComments` tinyint(1) NOT NULL DEFAULT '0',
  `fixOnTop` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_position`
--

CREATE TABLE `tbl_position` (
  `positionId` int(11) NOT NULL,
  `positionName` varchar(100) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `companyId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pos_course`
--

CREATE TABLE `tbl_pos_course` (
  `pos_courseId` int(11) NOT NULL,
  `positionId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `isMandatory` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_question`
--

CREATE TABLE `tbl_question` (
  `questionId` int(11) NOT NULL,
  `Question` text NOT NULL,
  `QuestionImg` varchar(100) NOT NULL,
  `Explanation` text NOT NULL,
  `CorrectAnswerOptionNumber` varchar(100) NOT NULL,
  `chapterId` int(11) NOT NULL DEFAULT '0',
  `CourseId` int(11) NOT NULL,
  `companyId` int(11) NOT NULL,
  `IsTraning` tinyint(1) NOT NULL DEFAULT '0',
  `cretedBy` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_QuestionOption`
--

CREATE TABLE `tbl_QuestionOption` (
  `QuestionOptionId` int(11) NOT NULL,
  `QuestionID` int(11) NOT NULL,
  `QuestionOptionName` varchar(200) NOT NULL,
  `QuestionOptionIndex` int(11) NOT NULL,
  `isAns` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_result`
--

CREATE TABLE `tbl_result` (
  `resultId` int(11) NOT NULL,
  `empId` int(11) NOT NULL,
  `CourseId` int(11) NOT NULL,
  `ChapterId` int(11) NOT NULL,
  `result` int(11) NOT NULL,
  `resultDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `emp_courseId` int(11) NOT NULL,
  `isCompleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_resultDetail`
--

CREATE TABLE `tbl_resultDetail` (
  `resultDetailId` int(11) NOT NULL,
  `QustionId` int(11) NOT NULL,
  `SelectOption` varchar(100) NOT NULL,
  `resultId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_subChapter`
--

CREATE TABLE `tbl_subChapter` (
  `subChapterId` int(11) NOT NULL,
  `ChapterId` int(11) NOT NULL,
  `IsVideo` int(1) NOT NULL DEFAULT '0' COMMENT '0(Offline), 1(Video), 2(Audio) , 3(Text), 4(SCORM), 5(SCORM-Subchapter)',
  `chapterTxt` text,
  `FilePath` varchar(200) NOT NULL,
  `subChapterTitle` varchar(500) NOT NULL,
  `trainerId` int(11) NOT NULL,
  `trainingDate` varchar(100) NOT NULL,
  `trainingstartTime` varchar(100) NOT NULL,
  `trainingPlace` varchar(500) NOT NULL,
  `trainingEndTime` varchar(200) NOT NULL,
  `trainingConfirmdEndTime` varchar(200) NOT NULL,
  `trainingConfirmdStartTime` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_subComment`
--

CREATE TABLE `tbl_subComment` (
  `SubComentId` int(11) NOT NULL,
  `CommentId` int(11) NOT NULL,
  `Comment` text NOT NULL,
  `DateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `empId` int(11) NOT NULL,
  `newsFeedId` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_trainer`
--

CREATE TABLE `tbl_trainer` (
  `trainerId` int(11) NOT NULL,
  `trainerCompId` int(45) DEFAULT NULL,
  `trainerEdu` varchar(100) DEFAULT NULL,
  `epath` varchar(200) NOT NULL,
  `FIRSTNAME` varchar(200) NOT NULL,
  `LASTNAME` varchar(100) NOT NULL,
  `GENDER` varchar(100) NOT NULL,
  `MOBILEPHONE` varchar(100) NOT NULL,
  `CURRENTADDRESS` varchar(1000) NOT NULL,
  `departmentId` varchar(20) NOT NULL,
  `Signature` varchar(200) NOT NULL,
  `trainerPostion` varchar(300) NOT NULL,
  `trainerTitle` varchar(200) NOT NULL,
  `createdByCompany` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `UserId` int(11) NOT NULL,
  `EmailID` varchar(45) DEFAULT NULL,
  `userPassword` varchar(80) DEFAULT NULL,
  `pwChangeNeeded` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Indicates whether a password change is needed at the next login or not.',
  `companyId` varchar(45) DEFAULT '0',
  `UserType` varchar(45) DEFAULT NULL,
  `isAuth` tinyint(1) NOT NULL,
  `empId` int(11) NOT NULL,
  `device_udid` varchar(300) NOT NULL,
  `device_OS` varchar(100) NOT NULL,
  `device_Version` varchar(100) NOT NULL,
  `deviceId` varchar(300) NOT NULL,
  `createdBy` int(11) NOT NULL,
  `authtoken` varchar(500) NOT NULL,
  `userName` varchar(200) NOT NULL,
  `userLang` varchar(10) NOT NULL DEFAULT 'de' COMMENT 'Defines the users language for the app',
  `dateTimeCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'user creation date time',
  `inactive` int(1) NOT NULL DEFAULT '0' COMMENT '0 => active, 1 => inactive by AD, 2 => inactive by system',
  `activeUntil` date DEFAULT NULL COMMENT 'If set => account is deactivated after specified date.',
  `ADUser` int(1) NOT NULL DEFAULT '0' COMMENT '0 => standard user, 1 => AD imported user',
  `ADUID` varchar(50) DEFAULT NULL COMMENT 'UID for active directory',
  `deactivateMail` int(1) NOT NULL DEFAULT '0' COMMENT '1 => don''t send mail reminder'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`UserId`, `EmailID`, `userPassword`, `pwChangeNeeded`, `companyId`, `UserType`, `isAuth`, `empId`, `device_udid`, `device_OS`, `device_Version`, `deviceId`, `createdBy`, `authtoken`, `userName`, `userLang`, `dateTimeCreated`, `inactive`, `activeUntil`, `ADUser`, `ADUID`, `deactivateMail`) VALUES
(1, 'local@smart-study.at', '$2y$10$.quHXef.MLqJI8iB1lUuuut142ByraQVLYgHSic.e.8QB4LcWQvX2', 0, '1', '2', 1, 1, '', '', '', '', 0, '', 'demo-admin', 'de', '2020-04-05 18:46:45', 0, NULL, 0, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_userType`
--

CREATE TABLE `tbl_userType` (
  `userTypeId` int(11) NOT NULL,
  `userType` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_userType`
--

INSERT INTO `tbl_userType` (`userTypeId`, `userType`) VALUES
(1, 'Super Admin'),
(2, 'Admin'),
(3, 'Trainer'),
(4, 'Employee');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_department`
--

CREATE TABLE `tbl_user_department` (
  `userDepartmentId` int(11) NOT NULL COMMENT 'Primary key',
  `userId` int(11) NOT NULL,
  `departmentId` int(11) NOT NULL,
  `dateAssigned` date NOT NULL,
  `isADAssignment` int(1) NOT NULL DEFAULT '0' COMMENT 'Set to 1 if assigned via Active Directory'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_group`
--

CREATE TABLE `tbl_user_group` (
  `userGroupId` int(11) NOT NULL COMMENT 'Primary key',
  `userId` int(11) NOT NULL COMMENT 'User ID',
  `groupId` int(11) NOT NULL,
  `dateAssigned` date NOT NULL,
  `isADAssignment` int(1) NOT NULL DEFAULT '0' COMMENT 'Set to 1 if assigned via Active Directory	'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_workgroups`
--

CREATE TABLE `tbl_workgroups` (
  `workgroupId` int(11) NOT NULL,
  `workgroupName` text NOT NULL,
  `locationId` int(11) NOT NULL,
  `isPrivate` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_certificater`
--
ALTER TABLE `tbl_certificater`
  ADD PRIMARY KEY (`certificaterId`);

--
-- Indexes for table `tbl_certificate_link`
--
ALTER TABLE `tbl_certificate_link`
  ADD PRIMARY KEY (`certificateLinkId`);

--
-- Indexes for table `tbl_chapter`
--
ALTER TABLE `tbl_chapter`
  ADD PRIMARY KEY (`chapterId`);

--
-- Indexes for table `tbl_ci_sessions`
--
ALTER TABLE `tbl_ci_sessions`
  ADD KEY `ci_sessions_timestamp` (`timestamp`);

--
-- Indexes for table `tbl_comment`
--
ALTER TABLE `tbl_comment`
  ADD PRIMARY KEY (`commentId`);

--
-- Indexes for table `tbl_company`
--
ALTER TABLE `tbl_company`
  ADD PRIMARY KEY (`companyId`);

--
-- Indexes for table `tbl_course`
--
ALTER TABLE `tbl_course`
  ADD PRIMARY KEY (`courseId`);

--
-- Indexes for table `tbl_course_assignment`
--
ALTER TABLE `tbl_course_assignment`
  ADD PRIMARY KEY (`courseAssId`);

--
-- Indexes for table `tbl_course_rights`
--
ALTER TABLE `tbl_course_rights`
  ADD PRIMARY KEY (`courseRightId`);

--
-- Indexes for table `tbl_department`
--
ALTER TABLE `tbl_department`
  ADD PRIMARY KEY (`departmentId`);

--
-- Indexes for table `tbl_employeess`
--
ALTER TABLE `tbl_employeess`
  ADD PRIMARY KEY (`empId`);

--
-- Indexes for table `tbl_emp_certi`
--
ALTER TABLE `tbl_emp_certi`
  ADD PRIMARY KEY (`empCertiId`);

--
-- Indexes for table `tbl_emp_course`
--
ALTER TABLE `tbl_emp_course`
  ADD PRIMARY KEY (`emp_courseId`);

--
-- Indexes for table `tbl_emp_scormChapter`
--
ALTER TABLE `tbl_emp_scormChapter`
  ADD PRIMARY KEY (`emp_scormChapterId`);

--
-- Indexes for table `tbl_emp_subChap`
--
ALTER TABLE `tbl_emp_subChap`
  ADD PRIMARY KEY (`empSubChapId`);

--
-- Indexes for table `tbl_feed`
--
ALTER TABLE `tbl_feed`
  ADD PRIMARY KEY (`feedId`);

--
-- Indexes for table `tbl_group`
--
ALTER TABLE `tbl_group`
  ADD PRIMARY KEY (`groupId`);

--
-- Indexes for table `tbl_group_category`
--
ALTER TABLE `tbl_group_category`
  ADD PRIMARY KEY (`categoryId`);

--
-- Indexes for table `tbl_group_category_assignment`
--
ALTER TABLE `tbl_group_category_assignment`
  ADD PRIMARY KEY (`gcaId`);

--
-- Indexes for table `tbl_group_rights`
--
ALTER TABLE `tbl_group_rights`
  ADD PRIMARY KEY (`groupRightId`);

--
-- Indexes for table `tbl_likeComments`
--
ALTER TABLE `tbl_likeComments`
  ADD PRIMARY KEY (`commentLikeid`);

--
-- Indexes for table `tbl_likeNewsfeed`
--
ALTER TABLE `tbl_likeNewsfeed`
  ADD PRIMARY KEY (`likeNewsId`);

--
-- Indexes for table `tbl_location`
--
ALTER TABLE `tbl_location`
  ADD PRIMARY KEY (`locationId`);

--
-- Indexes for table `tbl_message`
--
ALTER TABLE `tbl_message`
  ADD PRIMARY KEY (`messageId`);

--
-- Indexes for table `tbl_newsfeed`
--
ALTER TABLE `tbl_newsfeed`
  ADD PRIMARY KEY (`newsfeedId`);

--
-- Indexes for table `tbl_position`
--
ALTER TABLE `tbl_position`
  ADD PRIMARY KEY (`positionId`);

--
-- Indexes for table `tbl_pos_course`
--
ALTER TABLE `tbl_pos_course`
  ADD PRIMARY KEY (`pos_courseId`);

--
-- Indexes for table `tbl_question`
--
ALTER TABLE `tbl_question`
  ADD PRIMARY KEY (`questionId`);

--
-- Indexes for table `tbl_QuestionOption`
--
ALTER TABLE `tbl_QuestionOption`
  ADD PRIMARY KEY (`QuestionOptionId`);

--
-- Indexes for table `tbl_result`
--
ALTER TABLE `tbl_result`
  ADD PRIMARY KEY (`resultId`);

--
-- Indexes for table `tbl_resultDetail`
--
ALTER TABLE `tbl_resultDetail`
  ADD PRIMARY KEY (`resultDetailId`);

--
-- Indexes for table `tbl_subChapter`
--
ALTER TABLE `tbl_subChapter`
  ADD PRIMARY KEY (`subChapterId`);

--
-- Indexes for table `tbl_subComment`
--
ALTER TABLE `tbl_subComment`
  ADD PRIMARY KEY (`SubComentId`);

--
-- Indexes for table `tbl_trainer`
--
ALTER TABLE `tbl_trainer`
  ADD PRIMARY KEY (`trainerId`);

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`UserId`);

--
-- Indexes for table `tbl_userType`
--
ALTER TABLE `tbl_userType`
  ADD PRIMARY KEY (`userTypeId`);

--
-- Indexes for table `tbl_user_department`
--
ALTER TABLE `tbl_user_department`
  ADD PRIMARY KEY (`userDepartmentId`);

--
-- Indexes for table `tbl_user_group`
--
ALTER TABLE `tbl_user_group`
  ADD PRIMARY KEY (`userGroupId`);

--
-- Indexes for table `tbl_workgroups`
--
ALTER TABLE `tbl_workgroups`
  ADD PRIMARY KEY (`workgroupId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_certificater`
--
ALTER TABLE `tbl_certificater`
  MODIFY `certificaterId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_chapter`
--
ALTER TABLE `tbl_chapter`
  MODIFY `chapterId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `tbl_comment`
--
ALTER TABLE `tbl_comment`
  MODIFY `commentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_company`
--
ALTER TABLE `tbl_company`
  MODIFY `companyId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_course`
--
ALTER TABLE `tbl_course`
  MODIFY `courseId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `tbl_course_assignment`
--
ALTER TABLE `tbl_course_assignment`
  MODIFY `courseAssId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key', AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `tbl_course_rights`
--
ALTER TABLE `tbl_course_rights`
  MODIFY `courseRightId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key', AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_department`
--
ALTER TABLE `tbl_department`
  MODIFY `departmentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `tbl_employeess`
--
ALTER TABLE `tbl_employeess`
  MODIFY `empId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `tbl_emp_certi`
--
ALTER TABLE `tbl_emp_certi`
  MODIFY `empCertiId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_emp_course`
--
ALTER TABLE `tbl_emp_course`
  MODIFY `emp_courseId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `tbl_emp_scormChapter`
--
ALTER TABLE `tbl_emp_scormChapter`
  MODIFY `emp_scormChapterId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tbl_emp_subChap`
--
ALTER TABLE `tbl_emp_subChap`
  MODIFY `empSubChapId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_feed`
--
ALTER TABLE `tbl_feed`
  MODIFY `feedId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_group`
--
ALTER TABLE `tbl_group`
  MODIFY `groupId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Group ID', AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `tbl_group_category`
--
ALTER TABLE `tbl_group_category`
  MODIFY `categoryId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_group_category_assignment`
--
ALTER TABLE `tbl_group_category_assignment`
  MODIFY `gcaId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key';

--
-- AUTO_INCREMENT for table `tbl_group_rights`
--
ALTER TABLE `tbl_group_rights`
  MODIFY `groupRightId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key', AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `tbl_likeComments`
--
ALTER TABLE `tbl_likeComments`
  MODIFY `commentLikeid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_likeNewsfeed`
--
ALTER TABLE `tbl_likeNewsfeed`
  MODIFY `likeNewsId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_location`
--
ALTER TABLE `tbl_location`
  MODIFY `locationId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_message`
--
ALTER TABLE `tbl_message`
  MODIFY `messageId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_newsfeed`
--
ALTER TABLE `tbl_newsfeed`
  MODIFY `newsfeedId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_position`
--
ALTER TABLE `tbl_position`
  MODIFY `positionId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_pos_course`
--
ALTER TABLE `tbl_pos_course`
  MODIFY `pos_courseId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_question`
--
ALTER TABLE `tbl_question`
  MODIFY `questionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_QuestionOption`
--
ALTER TABLE `tbl_QuestionOption`
  MODIFY `QuestionOptionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tbl_result`
--
ALTER TABLE `tbl_result`
  MODIFY `resultId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_resultDetail`
--
ALTER TABLE `tbl_resultDetail`
  MODIFY `resultDetailId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_subChapter`
--
ALTER TABLE `tbl_subChapter`
  MODIFY `subChapterId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbl_subComment`
--
ALTER TABLE `tbl_subComment`
  MODIFY `SubComentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_trainer`
--
ALTER TABLE `tbl_trainer`
  MODIFY `trainerId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `tbl_userType`
--
ALTER TABLE `tbl_userType`
  MODIFY `userTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_user_department`
--
ALTER TABLE `tbl_user_department`
  MODIFY `userDepartmentId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key';

--
-- AUTO_INCREMENT for table `tbl_user_group`
--
ALTER TABLE `tbl_user_group`
  MODIFY `userGroupId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key', AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT for table `tbl_workgroups`
--
ALTER TABLE `tbl_workgroups`
  MODIFY `workgroupId` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
