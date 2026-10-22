#!/bin/sh
set -eu
control_dir="$(mktemp -d)"
trap 'rm -rf "$control_dir"' EXIT
pause_file="$control_dir/autologin.pause"
database_mode=mysql
touch "$control_dir/login-health-preserve-database"
. "$1"
[ "$startup_database_mode" = keep ]
[ "$database_mode" = mysql ]
[ ! -f "$control_dir/login-health-preserve-database" ]
clock_value=2000
restarts=0
network_ok=1
date() { if [ "$1" = '+%s' ]; then echo "$clock_value"; else echo '2026-10-22T08:00:00Z'; fi; }
nc() { [ "$network_ok" -eq 1 ]; }
restart_service() { restarts=$((restarts + 1)); }
timeout_reply='{"data":false,"message":"服务器响应超时,请检查网络是否通畅"}'
record_login_status rejected "$timeout_reply"
record_login_status rejected "$timeout_reply"
[ "$restarts" -eq 0 ]
record_login_status rejected "$timeout_reply"
[ "$restarts" -eq 1 ]
record_login_status rejected "$timeout_reply"
record_login_status rejected "$timeout_reply"
record_login_status rejected "$timeout_reply"
[ "$restarts" -eq 1 ]
clock_value=3000
record_login_status rejected "$timeout_reply"
[ "$restarts" -eq 2 ]
clock_value=5000
record_login_status rejected "$timeout_reply"
record_login_status rejected "$timeout_reply"
record_login_status rejected "$timeout_reply"
[ "$restarts" -eq 2 ]
record_login_status ok '{}'
[ "$login_timeout_count" -eq 0 ]
[ "$login_recoveries" -eq 0 ]
record_login_status rejected '{"message":"invalid password"}'
[ "$login_timeout_count" -eq 0 ]
network_ok=0
record_login_status rejected "$timeout_reply"
record_login_status rejected "$timeout_reply"
record_login_status rejected "$timeout_reply"
[ "$restarts" -eq 2 ]
network_ok=1
touch "$pause_file"
record_login_status rejected "$timeout_reply"
[ "$restarts" -eq 2 ]
echo 'login health: threshold, cooldown, retry cap, success reset, auth rejection, network outage, manual pause PASS'
