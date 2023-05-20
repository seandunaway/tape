#!/bin/sh

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
--disable-web-security \
--new-window \
--user-data-dir=/tmp/tape \
./index.html \
&
