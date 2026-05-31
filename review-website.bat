@echo off
echo =======================================================
echo     DENZI PORTFOLIO - LOCAL HTTP DEVELOPMENT SERVER
echo =======================================================
echo.
echo This script will spin up a local web server to let you
echo review and test the enhanced visual features (including 
echo 3D card tilt and the interactive comparison slider).
echo.

:: Check for Node.js / npm
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo [FOUND] Node.js ^& npm are installed.
    echo [ACTION] Launching server using lightweight 'http-server'...
    echo.
    echo >>> Opening browser at http://localhost:3000
    start "" "http://localhost:3000"
    npx -y http-server -p 3000
    goto end
)

:: Check for Python
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [FOUND] Python is installed.
    echo [ACTION] Launching server using 'python -m http.server'...
    echo.
    echo >>> Opening browser at http://localhost:3000
    start "" "http://localhost:3000"
    python -m http.server 3000
    goto end
)

:: Check for Python3
where python3 >nul 2>nul
if %errorlevel% equ 0 (
    echo [FOUND] Python3 is installed.
    echo [ACTION] Launching server using 'python3 -m http.server'...
    echo.
    echo >>> Opening browser at http://localhost:3000
    start "" "http://localhost:3000"
    python3 -m http.server 3000
    goto end
)

echo [WARNING] Neither Node.js (npm) nor Python was found on your system paths.
echo.
echo You can still review the website by double-clicking the 'index.html' 
echo file directly in your folder! (However, running a local server is 
echo recommended to prevent browser security warnings on external elements).
echo.
pause

:end
