# Sourced by autologin.sh. Repeated upstream timeouts must not look like a healthy login.
startup_database_mode="$database_mode"
if [ -f "$control_dir/login-health-preserve-database" ]; then
  startup_database_mode="keep"
  rm -f "$control_dir/login-health-preserve-database"
fi
login_timeout_count=0
login_recoveries=0
login_last_recovery=0

login_pause_is_managed() {
  [ -f "$pause_file" ] || return 1
  case "$(cat "$pause_file" 2>/dev/null)" in
    'logout before database switch'|'reload database configuration'|'database connection recovered'|'repeated upstream login timeout') ;;
    *) return 1 ;;
  esac
  case "$(cat "$control_dir/restart-completed" 2>/dev/null)" in
    autologin-*) return 0 ;;
  esac
  return 1
}

resume_managed_login_pause() {
  login_pause_is_managed || return 1
  [ ! -f "$restart_file" ] || return 1
  # The pause survives a container restart; the shell's ownership variable does not.
  managed_restart=1
  startup_database_mode=keep
  echo "Resuming an interrupted automatic recovery; keeping the current database configuration."
}

login_recovery_allowed() {
  [ ! -f "$pause_file" ] && return 0
  [ "${managed_restart:-0}" -eq 1 ] && login_pause_is_managed
}

record_login_paused() {
  login_checked_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf '{"checkedAt":"%s","status":"paused","consecutiveTimeouts":0,"recoveriesSinceSuccess":%s}\n' \
    "$login_checked_at" "$login_recoveries" > "$control_dir/login-state.json.tmp"
  mv "$control_dir/login-state.json.tmp" "$control_dir/login-state.json"
}

record_login_status() {
  login_status="$1"
  login_detail="rejected"
  case "$login_status" in
    ok)
      login_detail="ok"
      login_timeout_count=0
      login_recoveries=0
      ;;
    waiting)
      login_detail="transport_error"
      login_timeout_count=0
      ;;
    *)
      case "$2" in
        *'服务器响应超时'*)
          login_detail="upstream_timeout"
          login_timeout_count=$((login_timeout_count + 1))
          ;;
        *) login_timeout_count=0 ;;
      esac
      ;;
  esac
  login_checked_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf '{"checkedAt":"%s","status":"%s","consecutiveTimeouts":%s,"recoveriesSinceSuccess":%s}\n' \
    "$login_checked_at" "$login_detail" "$login_timeout_count" "$login_recoveries" > "$control_dir/login-state.json.tmp"
  mv "$control_dir/login-state.json.tmp" "$control_dir/login-state.json"

  login_now="$(date +%s)"
  if [ "$login_timeout_count" -ge 3 ] && [ "$login_recoveries" -lt 2 ] && \
     [ $((login_now - login_last_recovery)) -ge 900 ] && login_recovery_allowed; then
    # A reachable upstream TCP port distinguishes the observed stale process from a LAN outage.
    if nc -z -w 3 "${YOUCHAT_UPSTREAM_HOST:-139.196.171.27}" "${YOUCHAT_UPSTREAM_PORT:-7190}" >/dev/null 2>&1; then
      login_last_recovery="$login_now"
      login_recoveries=$((login_recoveries + 1))
      login_timeout_count=0
      echo "YouChat upstream login timed out repeatedly; requesting bounded process recovery."
      restart_service "repeated upstream login timeout" || return 1
    fi
  fi
}
