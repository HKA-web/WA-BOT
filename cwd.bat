@echo off
setlocal

set NODEJS_PORTABLE=%~dp0bin\nodejs
set PATH=%NODEJS_PORTABLE%;%NODEJS_PORTABLE%\node_modules\.bin;%PATH%

echo ===============================================
echo  Portable Node.js + Yarn Environment
echo -----------------------------------------------
echo  Node: %NODEJS_PORTABLE%\node.exe
echo -----------------------------------------------
"%NODEJS_PORTABLE%\node.exe" -v 2>nul || echo [ERROR] node.exe tidak bisa dijalankan
echo ===============================================
echo.
echo Ketik perintah Node/NPM/Yarn di bawah ini:
echo.

cmd /K
