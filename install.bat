@echo off
setlocal enabledelayedexpansion

:: -------------------------
:: Config
:: -------------------------
set "ROOT=%~dp0"
set "NODEJS_PORTABLE=%ROOT%bin\nodejs"

:: Pastikan bekerja di folder project root
pushd "%ROOT%"

:: Tambahkan portable node ke PATH untuk session ini
set "PATH=%NODEJS_PORTABLE%;%NODEJS_PORTABLE%\node_modules\.bin;%PATH%"

echo =================================================
echo  Portable Node.js + Yarn Menu
echo -------------------------------------------------
echo  Node executable: "%NODEJS_PORTABLE%\node.exe"
echo -------------------------------------------------

:: Cek Node
"%NODEJS_PORTABLE%\node.exe" -v 2>nul
if errorlevel 1 (
  echo [ERROR] node.exe tidak dapat dijalankan dari: "%NODEJS_PORTABLE%\node.exe"
  echo Pastikan folder "%NODEJS_PORTABLE%" berisi node.exe
  pause
  popd
  endlocal
  exit /b 1
)

:: tampilkan versi node
for /f "delims=" %%v in ('"%NODEJS_PORTABLE%\node.exe" -v') do set "NODE_VERSION=%%v"
echo  Node Version: %NODE_VERSION%
echo.

:MENU
echo Pilih opsi:
echo   1. Install dependencies (yarn install)
echo   2. Build project (yarn build)
echo   3. Set ngrok authtoken
echo   4. Keluar
set /P choice=Choice [1-4]: 

if "%choice%"=="1" goto INSTALL
if "%choice%"=="2" goto BUILD
if "%choice%"=="3" goto NGROK_AUTH
if "%choice%"=="4" goto END

echo Pilihan tidak valid.
goto MENU

:INSTALL
set "ANS="
set /P ANS=Hapus folder node_modules sebelum install? (Y/N) :

if /I "%ANS%"=="Y" (
    if exist "%ROOT%node_modules" (
        echo Menghapus "%ROOT%node_modules" ...
        rd /s /q "%ROOT%node_modules" 2>nul
        if errorlevel 1 (
            echo [ERROR] Gagal menghapus "%ROOT%node_modules"
            echo Pastikan tidak ada file/antarmuka yang menahan folder tersebut.
            pause
            goto MENU
        ) else (
            echo Berhasil menghapus node_modules.
        )
    ) else (
        echo Folder node_modules tidak ditemukan, lanjut...
    )
) else (
    echo Melewati penghapusan node_modules.
)

echo.
echo Memulai proses install dependencies (yarn install)...
echo -------------------------------------------------
call :run_yarn install
echo.
pause
goto MENU

:BUILD
echo.
echo Memulai proses build (yarn build)...
echo -------------------------------------------------
call :run_yarn build
echo.
pause
goto MENU

:NGROK_AUTH
echo.
echo Menjalankan ngrok authtoken setup...
echo -------------------------------------------------
if exist "%ROOT%node_modules\.bin\ngrok.cmd" (
    "%ROOT%node_modules\.bin\ngrok.cmd" config add-authtoken 29n6p4A4htzGD7rJ06W1yAMDKom_5EvEY4ST9fyeqZ5SnxrGv
) else (
    echo [ERROR] ngrok tidak ditemukan di node_modules/.bin
    echo Pastikan sudah install: yarn add ngrok -D
)
echo.
pause
goto MENU

:END
echo Keluar dari script...
pause
popd
endlocal
exit /b 0

:: -------------------------
:: Subroutines
:: -------------------------
:run_yarn
set "ACTION=%~1"

:: 1) Jika project-local yarn tersedia (node_modules/.bin/yarn.cmd)
if exist "%ROOT%node_modules\.bin\yarn.cmd" (
    echo Menggunakan yarn lokal di "%ROOT%node_modules\.bin\yarn.cmd"
    "%ROOT%node_modules\.bin\yarn.cmd" %ACTION%
    exit /b %ERRORLEVEL%
)

:: 2) Jika portable node punya yarn di node_modules
if exist "%NODEJS_PORTABLE%\node_modules\.bin\yarn.cmd" (
    echo Menggunakan yarn di portable node: "%NODEJS_PORTABLE%\node_modules\.bin\yarn.cmd"
    "%NODEJS_PORTABLE%\node_modules\.bin\yarn.cmd" %ACTION%
    exit /b %ERRORLEVEL%
)

:: 3) Jika portable node punya yarn.js (node + yarn js)
if exist "%NODEJS_PORTABLE%\node_modules\yarn\bin\yarn.js" (
    echo Menjalankan yarn via node: yarn.js di portable node
    "%NODEJS_PORTABLE%\node.exe" "%NODEJS_PORTABLE%\node_modules\yarn\bin\yarn.js" %ACTION%
    exit /b %ERRORLEVEL%
)

:: 4) Jika npm ada di portable node, coba install yarn global lalu jalankan
if exist "%NODEJS_PORTABLE%\npm.cmd" (
    echo Yarn tidak ditemukan; mencoba install yarn secara global menggunakan npm portable...
    "%NODEJS_PORTABLE%\npm.cmd" install -g yarn
    if errorlevel 1 (
        echo [ERROR] Gagal install yarn secara global via npm.
        exit /b 2
    )
    where yarn >nul 2>nul
    if "%ERRORLEVEL%"=="0" (
        echo Menjalankan yarn global yang baru diinstall...
        yarn %ACTION%
        exit /b %ERRORLEVEL%
    )
)

:: 5) Coba fallback ke system-wide yarn (jika ada di PATH)
where yarn >nul 2>nul
if "%ERRORLEVEL%"=="0" (
    echo Menggunakan yarn system (di PATH)...
    yarn %ACTION%
    exit /b %ERRORLEVEL%
)

:: 6) Jika tidak ada sama sekali
echo [ERROR] Tidak ditemukan yarn atau npm yang usable pada environment portable ini.
exit /b 4
goto :eof
