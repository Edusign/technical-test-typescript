create table COURSES (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME varchar(128) not null,
    DESCRIPTION text null,
    START datetime not null,
    END datetime not null,
    DATE_CREATED datetime default CURRENT_TIMESTAMP not null,
    DATE_UPDATED datetime default CURRENT_TIMESTAMP not null
);

create table STUDENTS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    FIRST_NAME varchar(128) not null,
    LAST_NAME varchar(128) not null,
    EMAIL varchar(128) not null,
    DATE_CREATED datetime default CURRENT_TIMESTAMP not null,
    DATE_UPDATED datetime default CURRENT_TIMESTAMP not null,
    constraint STUDENTS_EMAIL_UNIQUE unique (EMAIL)
);

create table STUDENT_STATES (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    COURSE_ID int not null,
    STUDENT_ID int not null,
    STATE tinyint(1) default 0 not null,
    EXCLUDED datetime null,
    DELAY int default 0 not null,
    EARLY_DEPARTURE datetime null,
    TIMESTAMP datetime null,
    SIGNATURE varchar(255) null,
    COMMENT mediumtext null,
    DATE_UPDATED datetime default CURRENT_TIMESTAMP not null,
    DATE_CREATED datetime default CURRENT_TIMESTAMP not null,
    constraint STUDENT_STATES_COURSE_ID foreign key (COURSE_ID) references COURSES (ID) on update cascade on delete cascade,
    constraint STUDENT_STATES_STUDENT_ID foreign key (STUDENT_ID) references STUDENTS (ID) on update cascade on delete cascade
);
