@echo off
setlocal enabledelayedexpansion

REM החלף את שם המשתמש שלך כאן:
set "USERNAME=your-username"

REM שורת פקודה שמביאה עד 1000 ריפוזיטוריז
for /f "tokens=1 delims= " %%A in ('gh repo list %USERNAME% --limit 1000') do (
    echo הופך את %%A לפרטי...
    gh repo edit %%A --visibility private
)
echo.
echo כל הריפוזיטוריז הפכו לפרטיים (ככל האפשר).
pause
