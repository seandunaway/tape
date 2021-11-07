@echo off
start "tape" /B "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" ^
--disable-web-security ^
--new-window ^
--user-data-dir=C:\tmp\chrome\ ^
"file:///%CD%/index.html"
