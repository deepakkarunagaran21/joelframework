@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "Joel Frame Work's Website" http://localhost:8000/index.html
  py -m http.server 8000
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "Joel Frame Work's Website" http://localhost:8000/index.html
  python -m http.server 8000
  goto :eof
)
echo Python was not found. Install Python from https://www.python.org/downloads/ and tick "Add Python to PATH", then run this file again.
pause
