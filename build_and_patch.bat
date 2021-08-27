@echo off
set datetimef=%date:~-2%_%date:~3,3%_%date:~0,2%__%time%
set datetimef=%datetimef::=-%
set newfolder=Smart-Study_backup_%datetimef:.=-%
fc src\app\patches\ngsw-worker-backup.js node_modules\@angular\service-worker\ngsw-worker.js > nul
IF NOT %errorlevel%==0 (
    echo ========================================================
    echo ========================================================
    echo ====                     ERROR!                     ====
    echo ====   ngsw-worker.js file seems to have changed!   ====
    echo ========================================================
    echo ========================================================
) ELSE (
    IF EXIST dist/Smart-Study (
        RENAME "dist\Smart-Study" %newfolder%
    )
    ng build --prod && xcopy "./src/app/patches/ngsw-worker.js" "./dist/Smart-Study/ngsw-worker.js" /f /y
)