@echo off
title HubSpot CRM Configurator - Crescent Connect LA
echo.
echo  Starting the HubSpot CRM Configurator...
echo  Your browser will open automatically in a few seconds.
echo.
echo  KEEP THIS BLACK WINDOW OPEN while you use the app.
echo  Close this window when you're done to shut it down.
echo.
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
call "C:\Program Files\nodejs\npm.cmd" run dev
pause
