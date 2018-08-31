#!/bin/bash
# fetchunsplash-install.sh
# Installs fetchunsplash as a cron job with the corrent environment variables.

# TODO Guide User To Create .env File
UNSPLASH_APPID=""
UNSPLASH_APPSECRET=""
UNSPLASH_CALLBACK="https://www.google.com"

# Copy script to cron.daily folder
cp ./fetchunsplash.js /etc/cron.daily/fetchunsplash.js
cd /etc/cron.daily/
chmod 755 fetchunsplash.js

# TODO Edit Cron Config

# To use different editor:
# EDITOR="gedit" crontab -e
crontab -e

# cron scheduler:
# * 1 2 3 4 = day of week (sunday=0 or 7)
# 0 * 2 3 4 = month (1-12)
# 0 1 * 3 4 = day of month (1-31)
# 0 1 2 * 4 = hour (0-23)
# 0 1 2 3 * = minute (0-59)

# <schedule> <cmd> <arg1> <arg2> ... <argN>
# 0 0 * * * node /etc/cron.daily/fetchunsplash.js -d /home/chief/Pictures/wallpapers/ -c 24 -s popular