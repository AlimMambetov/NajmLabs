@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: Коды цветов ANSI
set "GREEN=[92m"
set "YELLOW=[93m"
set "CYAN=[96m"
set "RED=[91m"
set "RESET=[0m"

:: Проверяем существует ли package.json
if not exist package.json (
    echo %RED%❌ package.json не найден!%RESET%
    pause
    exit /b
)

:: Показываем текущую версию
for /f "tokens=2 delims=:" %%a in ('findstr /i "\"version\":" package.json') do (
    set "line=%%a"
    set "line=!line:,=!"
    set "line=!line:\"=!"
    set "line=!line: =!"
    set "CURRENT_VERSION=!line!"
)

echo %YELLOW%📦 Текущая версия:%RESET% %CYAN%%CURRENT_VERSION%%RESET%
echo.
echo Выберите тип обновления:
echo 1 - Major (%GREEN%x%RESET%.0.0)
echo 2 - Minor (0.%GREEN%x%RESET%.0)
echo 3 - Patch (0.0.%GREEN%x%RESET%)
echo.

set /p CHOICE="Выбор: "

if "%CHOICE%"=="1" (
    echo.
    npm version major
) else if "%CHOICE%"=="2" (
    echo.
    npm version minor
) else if "%CHOICE%"=="3" (
    echo.
    npm version patch
) else (
    echo %RED%❌ Неверный выбор%RESET%
    pause
    exit /b
)

pause