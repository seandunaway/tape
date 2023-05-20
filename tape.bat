@echo off
mkdir "C:\tmp\tape\"
start "tape" /B "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" ^
--disable-web-security ^
--new-window ^
--user-data-dir=C:\tmp\tape\ ^
"file:///%CD%/index.html"
