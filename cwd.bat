@echo off
setlocal

:: Root folder (folder dimana script ini berada)
set "ROOT=%~dp0"

:: Path ke portable Node.js (sesuaikan jika beda)
set "NODEJS_PORTABLE=%ROOT%bin\nodejs"

:: Path ke Python
set "PYTHON_HOME=C:\WA-BOT\bin\python"

:: Tambahkan Python, portable node & local node_modules/.bin ke PATH session ini
set "PATH=%PYTHON_HOME%;%NODEJS_PORTABLE%;%NODEJS_PORTABLE%\node_modules\.bin;%PATH%"

echo ===============================================
echo  Portable Node.js + Python + Yarn Environment
echo -----------------------------------------------
echo  Node exe path: "%NODEJS_PORTABLE%\node.exe"
echo  Python path:  "%PYTHON_HOME%\python.exe"
echo -----------------------------------------------

:: cek node
"%NODEJS_PORTABLE%\node.exe" -v >nul 2>&1
if errorlevel 1 (
  echo [ERROR] node.exe tidak bisa dijalankan dari "%NODEJS_PORTABLE%\node.exe"
  echo Pastikan folder "%NODEJS_PORTABLE%" berisi node.exe
  echo.
  pause
  endlocal
  exit /b 1
)

:: cek python
"%PYTHON_HOME%\python.exe" --version >nul 2>&1
if errorlevel 1 (
  echo [ERROR] python.exe tidak bisa dijalankan dari "%PYTHON_HOME%\python.exe"
  echo Pastikan folder "%PYTHON_HOME%" berisi python.exe
  echo.
  pause
  endlocal
  exit /b 1
)

for /f "delims=" %%v in ('"%NODEJS_PORTABLE%\node.exe" -v 2^>nul') do set "NODE_VERSION=%%v"
echo  Node Version: %NODE_VERSION%
for /f "delims=" %%v in ('"%PYTHON_HOME%\python.exe" --version 2^>nul') do set "PYTHON_VERSION=%%v"
echo  Python Version: %PYTHON_VERSION%
echo ===============================================
echo.

:: ------------------------
:: Argument parser
:: ------------------------
set "choice="
if /i "%~2"=="1" set "choice=1"
if /i "%~2"=="2" set "choice=2"
if /i "%~2"=="3" set "choice=3"

:: Kalau ada argumen → langsung eksekusi, tanpa menu
if defined choice (
    echo [INFO] Argumen mendeteksi pilihan: %choice%
    goto DO_CHOICE_DIRECT
)

:: ========================
:: Menu interaktif
:: ========================
:MENU
echo Pilih tindakan:
echo   1. Buka interactive shell (cmd)
echo   2. Jalankan "yarn start"
echo   3. Keluar
set /P choice=Choice [1-3]:

:DO_CHOICE
if "%choice%"=="1" goto INTERACTIVE
if "%choice%"=="2" goto YARN_START
if "%choice%"=="3" goto END
echo Pilihan tidak valid.
echo.
goto MENU

:: ========================
:: Eksekusi langsung (argumen)
:: ========================
:DO_CHOICE_DIRECT
if "%choice%"=="1" goto INTERACTIVE
if "%choice%"=="2" goto YARN_START
if "%choice%"=="3" goto END
goto END

:INTERACTIVE
echo Membuka interactive shell. Ketik exit untuk menutup shell.
echo.
cmd /k "cd /d %ROOT%"
goto END

:YARN_START
echo Menjalankan "yarn start" (foreground)...
cd /d "%ROOT%"
yarn start
echo.
echo [INFO] "yarn start" keluar dengan code %ERRORLEVEL%
if not defined choice (
    echo Tekan tombol apapun untuk kembali ke menu...
    pause >nul
    goto MENU
)
goto END

:END
endlocal
exit /b 0
