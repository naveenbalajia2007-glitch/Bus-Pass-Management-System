@echo off
set DB_PASSWORD=Nithu@7726
set DB_NAME=buspasssystem
set MYSQL_EXE="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

echo [1/3] Resetting NexPass Ride Portal Database...
%MYSQL_EXE% -u root -p%DB_PASSWORD% -e "DROP DATABASE IF EXISTS %DB_NAME%; CREATE DATABASE %DB_NAME%;"

echo [2/3] Importing Extended Tamil Nadu Schema Institutions...
%MYSQL_EXE% -u root -p%DB_PASSWORD% %DB_NAME% < database\schema.sql

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Schema import failed.
    pause
    exit /b %ERRORLEVEL%
)

echo [3/3] Database Reload Complete!
echo Brand: NexPass Ride Portal
echo Regions: 38 TN Districts Preloaded
pause
