@echo off
REM Wrapper so the preview spawner finds node/npm even with a stale host PATH.
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "C:\Users\Daniel\Claude_Home\crescent-connect\apps\hubspot-crm-configurator"
call "C:\Program Files\nodejs\npm.cmd" run dev
