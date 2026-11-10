@echo off
title ModelDock Documentation Local Preview
echo ========================================================
echo   ModelDock Documentation Preview Server
echo ========================================================
echo Starting local web server on http://localhost:8080 ...
echo Press Ctrl+C to stop the server anytime.
echo ========================================================
start "" http://localhost:8080
python -m http.server 8080
pause
