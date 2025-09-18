@echo off
setlocal enabledelayedexpansion

:: --- Load PORT ---
set "PORT_DEFAULT=3000"
set "PORT="

for /f "usebackq tokens=1,2 delims==" %%a in (".env") do (
    if "%%a"=="PORT" set "PORT=%%b"
)

if "%PORT%"=="" (
    set "PORT=%PORT_DEFAULT%"
)

echo [INFO] Menjalankan ngrok di port %PORT%
.\node_modules\.bin\ngrok.cmd http %PORT%
