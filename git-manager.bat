@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: Коды цветов ANSI
set "GREEN=[92m"
set "YELLOW=[93m"
set "CYAN=[96m"
set "RED=[91m"
set "BLUE=[94m"
set "MAGENTA=[95m"
set "WHITE=[97m"
set "RESET=[0m"

:: Проверка git
where git >nul 2>nul
if errorlevel 1 (
    echo %RED%❌ Git не найден! Установи Git%RESET%
    pause
    exit /b
)

:: Проверка репозитория
git rev-parse --git-dir >nul 2>nul
if errorlevel 1 (
    echo %RED%❌ Это не git репозиторий!%RESET%
    pause
    exit /b
)

:MAIN_MENU
cls
echo %BLUE%╔════════════════════════════════════════════╗%RESET%
echo %BLUE%║     🛠️  Git Commit Tools v1.0             ║%RESET%
echo %BLUE%╚════════════════════════════════════════════╝%RESET%
echo.

:: Текущая информация
for /f %%i in ('git branch --show-current') do set "BRANCH=%%i"
git status --porcelain | findstr . >nul
if errorlevel 1 (set "STATUS=✅ Чисто") else (set "STATUS=📝 Есть изменения")

echo %CYAN%🌿 Текущая ветка:%RESET% %BRANCH%
echo %CYAN%📊 Статус:%RESET%       %STATUS%
echo %CYAN%📋 Последний коммит:%RESET%
git log -1 --oneline 2>nul
echo.

echo %GREEN%════════════════════════════════════════════%RESET%
echo %YELLOW%   📦 ОПЕРАЦИИ С КОММИТАМИ%RESET%
echo %GREEN%════════════════════════════════════════════%RESET%
echo.
echo  %WHITE%1.%RESET%  ⚡ Быстрый коммит (авто-сообщение)
echo  %WHITE%2.%RESET%  📝 Обычный коммит (ввести сообщение)
echo  %WHITE%3.%RESET%  🏷️  Коммит с версией (из package.json)
echo.

echo %GREEN%════════════════════════════════════════════%RESET%
echo %YELLOW%   🔄 ОТМЕНА И ИЗМЕНЕНИЕ%RESET%
echo %GREEN%════════════════════════════════════════════%RESET%
echo.
echo  %WHITE%4.%RESET%  ↩️  Отменить последний коммит (сохранить файлы)
echo  %WHITE%5.%RESET%  🔄 Отменить последний коммит (удалить изменения)
echo  %WHITE%6.%RESET%  ✏️  Изменить сообщение последнего коммита
echo.

echo %GREEN%════════════════════════════════════════════%RESET%
echo %YELLOW%   🌿 РАБОТА С ВЕТКАМИ%RESET%
echo %GREEN%════════════════════════════════════════════%RESET%
echo.
echo  %WHITE%7.%RESET%  📋 Показать все ветки (локальные + удаленные)
echo  %WHITE%8.%RESET%  🌱 Создать новую ветку
echo  %WHITE%9.%RESET%  🔀 Переключиться на ветку
echo  %WHITE%10.%RESET% 🗑️  Удалить ветку
echo.

echo %GREEN%════════════════════════════════════════════%RESET%
echo %YELLOW%   🔀 ПРОСМОТР%RESET%
echo %GREEN%════════════════════════════════════════════%RESET%
echo.
echo  %WHITE%11.%RESET% 👀 Показать историю коммитов
echo  %WHITE%12.%RESET% 🔍 Найти коммит по сообщению
echo  %WHITE%13.%RESET% 🔀 Переключиться на другой коммит (временно)
echo  %WHITE%14.%RESET% 🔙 Вернуться на ветку (из detached HEAD)
echo.

echo %GREEN%════════════════════════════════════════════%RESET%
echo %YELLOW%   📤 PUSH / FETCH%RESET%
echo %GREEN%════════════════════════════════════════════%RESET%
echo.
echo  %WHITE%15.%RESET% 🚀 Запушить коммиты
echo  %WHITE%16.%RESET% 📥 Забрать изменения (fetch)
echo  %WHITE%17.%RESET% 🔄 Pull с перебазированием
echo.

echo %RED%════════════════════════════════════════════%RESET%
echo %YELLOW%   0. ВЫХОД%RESET%
echo %RED%════════════════════════════════════════════%RESET%
echo.

set /p CHOICE="👉 Выберите действие (0-17): "

if "%CHOICE%"=="0" exit /b
if "%CHOICE%"=="1" goto :quick_commit
if "%CHOICE%"=="2" goto :normal_commit
if "%CHOICE%"=="3" goto :version_commit
if "%CHOICE%"=="4" goto :undo_soft
if "%CHOICE%"=="5" goto :undo_hard
if "%CHOICE%"=="6" goto :amend_commit
if "%CHOICE%"=="7" goto :show_branches
if "%CHOICE%"=="8" goto :create_branch
if "%CHOICE%"=="9" goto :switch_branch
if "%CHOICE%"=="10" goto :delete_branch
if "%CHOICE%"=="11" goto :show_log
if "%CHOICE%"=="12" goto :search_commit
if "%CHOICE%"=="13" goto :checkout_commit
if "%CHOICE%"=="14" goto :return_branch
if "%CHOICE%"=="15" goto :push_changes
if "%CHOICE%"=="16" goto :fetch_changes
if "%CHOICE%"=="17" goto :pull_rebase

echo %RED%❌ Неверный выбор%RESET%
timeout /t 2 >nul
goto MAIN_MENU

:: ============================================
:: КОММИТЫ
:: ============================================

:quick_commit
cls
echo %YELLOW%⚡ Быстрый коммит%RESET%
echo.
set "COMMIT_MSG=Update: %date% %time%"
echo %CYAN%📝 Сообщение: !COMMIT_MSG!%RESET%
echo.
git add .
git commit -m "!COMMIT_MSG!"
goto :commit_result

:normal_commit
cls
echo %YELLOW%📝 Обычный коммит%RESET%
echo.
git status -s
echo.
set /p COMMIT_MSG="💬 Введите сообщение коммита: "
if "!COMMIT_MSG!"=="" (
    echo %RED%❌ Сообщение не может быть пустым%RESET%
    pause
    goto MAIN_MENU
)
git add .
git commit -m "!COMMIT_MSG!"
goto :commit_result

:version_commit
cls
echo %YELLOW%🏷️  Коммит с версией%RESET%
echo.
if not exist package.json (
    echo %RED%❌ package.json не найден%RESET%
    pause
    goto MAIN_MENU
)
for /f "tokens=2 delims=:" %%a in ('findstr /i "\"version\":" package.json') do (
    set "ver=%%a"
    set "ver=!ver:,=!"
    set "ver=!ver:\"=!"
    set "ver=!ver: =!"
)
set "COMMIT_MSG=release: v!ver!"
echo %CYAN%📝 Сообщение: !COMMIT_MSG!%RESET%
git add .
git commit -m "!COMMIT_MSG!"
goto :commit_result

:: ============================================
:: ОТМЕНА КОММИТОВ
:: ============================================

:undo_soft
cls
echo %YELLOW%↩️  Отмена последнего коммита (сохранить файлы)%RESET%
echo.
git log -3 --oneline
echo.
set /p CONFIRM="❓ Отменить последний коммит (soft)? (y/n): "
if /i "!CONFIRM!"=="y" (
    git reset --soft HEAD~1
    echo %GREEN%✅ Последний коммит отменен, изменения сохранены%RESET%
    echo.
    git status -s
)
pause
goto MAIN_MENU

:undo_hard
cls
echo %YELLOW%🔄 Отмена последнего коммита (удалить изменения)%RESET%
echo.
git log -3 --oneline
echo.
echo %RED%⚠️  ВНИМАНИЕ: Изменения будут УДАЛЕНЫ!%RESET%
set /p CONFIRM="❓ Точно отменить коммит (hard)? (y/n): "
if /i "!CONFIRM!"=="y" (
    git reset --hard HEAD~1
    echo %GREEN%✅ Последний коммит удален%RESET%
)
pause
goto MAIN_MENU

:amend_commit
cls
echo %YELLOW%✏️  Изменить сообщение последнего коммита%RESET%
echo.
git log -3 --oneline
echo.
git show --stat HEAD
echo.
set /p NEW_MSG="💬 Новое сообщение: "
if "!NEW_MSG!"=="" (
    echo %RED%❌ Сообщение не может быть пустым%RESET%
    pause
    goto MAIN_MENU
)
git commit --amend -m "!NEW_MSG!"
echo %GREEN%✅ Сообщение коммита изменено%RESET%
pause
goto MAIN_MENU

:: ============================================
:: РАБОТА С ВЕТКАМИ
:: ============================================

:show_branches
cls
echo %YELLOW%📋 Все ветки%RESET%
echo.
echo %CYAN%Локальные ветки:%RESET%
git branch
echo.
echo %CYAN%Удаленные ветки:%RESET%
git branch -r
echo.
echo %CYAN%Последние коммиты на ветках:%RESET%
git branch -vv
echo.
pause
goto MAIN_MENU

:create_branch
cls
echo %YELLOW%🌱 Создание новой ветки%RESET%
echo.
set /p NEW_BRANCH="📝 Введите название новой ветки: "
if "!NEW_BRANCH!"=="" (
    echo %RED%❌ Название не может быть пустым%RESET%
    pause
    goto MAIN_MENU
)

echo.
echo "1 - Создать и переключиться"
echo "2 - Только создать"
echo "0 - Отмена"
echo.
set /p BRANCH_CHOICE="Выбор: "

if "!BRANCH_CHOICE!"=="1" (
    git checkout -b !NEW_BRANCH!
    echo %GREEN%✅ Ветка !NEW_BRANCH! создана и активирована%RESET%
) else if "!BRANCH_CHOICE!"=="2" (
    git branch !NEW_BRANCH!
    echo %GREEN%✅ Ветка !NEW_BRANCH! создана%RESET%
) else (
    echo "Отмена"
)
pause
goto MAIN_MENU

:switch_branch
cls
echo %YELLOW%🔀 Переключение ветки%RESET%
echo.
echo %CYAN%Локальные ветки:%RESET%
git branch
echo.
echo %CYAN%Удаленные ветки:%RESET%
git branch -r
echo.
set /p SWITCH_BRANCH="📝 Введите название ветки для переключения: "
if "!SWITCH_BRANCH!"=="" (
    echo %RED%❌ Название не может быть пустым%RESET%
    pause
    goto MAIN_MENU
)

:: Проверяем существует ли ветка локально
git show-ref --verify --quiet refs/heads/!SWITCH_BRANCH!
if !errorlevel! equ 0 (
    git checkout !SWITCH_BRANCH!
    echo %GREEN%✅ Переключились на !SWITCH_BRANCH!%RESET%
) else (
    echo %YELLOW%⚠️  Локальной ветки нет. Создать из удаленной?%RESET%
    set /p CREATE_FROM_REMOTE="Создать локальную ветку из origin/!SWITCH_BRANCH!? (y/n): "
    if /i "!CREATE_FROM_REMOTE!"=="y" (
        git checkout -b !SWITCH_BRANCH! origin/!SWITCH_BRANCH!
        echo %GREEN%✅ Создана и переключена ветка !SWITCH_BRANCH! из удаленной%RESET%
    )
)
pause
goto MAIN_MENU

:delete_branch
cls
echo %YELLOW%🗑️  Удаление ветки%RESET%
echo.
echo %CYAN%Текущие ветки:%RESET%
git branch
echo.
set /p DEL_BRANCH="📝 Введите название ветки для удаления: "
if "!DEL_BRANCH!"=="" (
    echo %RED%❌ Название не может быть пустым%RESET%
    pause
    goto MAIN_MENU
)

if "!DEL_BRANCH!"=="%BRANCH%" (
    echo %RED%❌ Нельзя удалить текущую ветку!%RESET%
    pause
    goto MAIN_MENU
)

echo.
echo "1 - Обычное удаление (только если смержено)"
echo "2 - Принудительное удаление"
echo "0 - Отмена"
echo.
set /p DEL_CHOICE="Выбор: "

if "!DEL_CHOICE!"=="1" (
    git branch -d !DEL_BRANCH!
    if !errorlevel! equ 0 (
        echo %GREEN%✅ Ветка !DEL_BRANCH! удалена%RESET%
    ) else (
        echo %RED%❌ Не удалось удалить. Возможно не смержено%RESET%
    )
) else if "!DEL_CHOICE!"=="2" (
    git branch -D !DEL_BRANCH!
    echo %GREEN%✅ Ветка !DEL_BRANCH! принудительно удалена%RESET%
) else (
    echo "Отмена"
)
pause
goto MAIN_MENU

:: ============================================
:: ПРОСМОТР
:: ============================================

:show_log
cls
echo %YELLOW%👀 История коммитов%RESET%
echo.
git log --graph --pretty=format:"%%C(yellow)%%h%%C(cyan)%%d%%Creset %%s %%C(green)(%%cr)%%Creset" --abbrev-commit -20
echo.
pause
goto MAIN_MENU

:search_commit
cls
echo %YELLOW%🔍 Поиск коммита по сообщению%RESET%
echo.
set /p SEARCH="🔎 Введите текст для поиска: "
git log --oneline --grep="!SEARCH!" -10
pause
goto MAIN_MENU

:checkout_commit
cls
echo %YELLOW%🔀 Переключиться на коммит (временно)%RESET%
echo.
git log --oneline -10
echo.
set /p HASH="🔑 Введите хеш коммита (первые 7 символов): "
git checkout !HASH!
echo %YELLOW%⚠️  Ты в состоянии detached HEAD! Используй пункт 14 чтобы вернуться%RESET%
pause
goto MAIN_MENU

:return_branch
cls
echo %YELLOW%🔙 Вернуться на ветку%RESET%
echo.
for /f %%i in ('git branch --show-current 2^>nul') do set "BRANCH=%%i"
if "!BRANCH!"=="" (
    git checkout main 2>nul || git checkout master
) else (
    git checkout !BRANCH!
)
echo %GREEN%✅ Вернулись на ветку%RESET%
pause
goto MAIN_MENU

:: ============================================
:: PUSH / FETCH
:: ============================================

:push_changes
cls
echo %YELLOW%🚀 Push коммитов%RESET%
echo.
for /f %%i in ('git branch --show-current') do set "BRANCH=%%i"
git status
echo.
set /p CONFIRM="❓ Запушить в origin/!BRANCH!? (y/n): "
if /i "!CONFIRM!"=="y" (
    git push origin !BRANCH!
    if !errorlevel! equ 0 (
        echo %GREEN%✅ Успешно запущено%RESET%
    ) else (
        echo %RED%❌ Ошибка пуша%RESET%
    )
)
pause
goto MAIN_MENU

:fetch_changes
cls
echo %YELLOW%📥 Fetch изменений%RESET%
git fetch --all --prune
echo %GREEN%✅ Fetch выполнен%RESET%
pause
goto MAIN_MENU

:pull_rebase
cls
echo %YELLOW%🔄 Pull с перебазированием%RESET%
echo.
for /f %%i in ('git branch --show-current') do set "BRANCH=%%i"
git pull --rebase origin !BRANCH!
pause
goto MAIN_MENU

:: ============================================
:: ОБЩИЙ РЕЗУЛЬТАТ
:: ============================================

:commit_result
if errorlevel 1 (
    echo %RED%❌ Ошибка при коммите%RESET%
) else (
    echo %GREEN%✅ Коммит создан!%RESET%
    echo.
    git log -1 --oneline
)
echo.
pause
goto MAIN_MENU