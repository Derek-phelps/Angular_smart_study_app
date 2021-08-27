@echo off
set datetimef=%date:~-2%_%date:~3,3%_%date:~0,2%__%time%
set datetimef=%datetimef::=-%
set newfolder=Smart-Study_backup_%datetimef:.=-%

IF EXIST dist/Smart-Study (
    RENAME "dist\Smart-Study" %newfolder%
)
ng build --prod --base-href ./
