#!/bin/sh

set -u

app_dir="${YOUCHAT_APP_DIR:-/app}"
control_dir="${YOUCHAT_CONTROL_DIR:-/control}"
mode="${YOUCHAT_DATABASE_MODE:-mysql}"

log() {
  printf '[config-guard] %s\n' "$*"
}

load_env_file() {
  if [ -f "$app_dir/.env" ]; then
    set -a
    # shellcheck disable=SC1091
    . "$app_dir/.env"
    set +a
    mode="${YOUCHAT_DATABASE_MODE:-$mode}"
  fi
}

find_config_file() {
  found="$(find "$app_dir" -maxdepth 1 -type f -name '*YouChatConfig.json' -print -quit 2>/dev/null || true)"
  if [ -n "$found" ]; then
    printf '%s\n' "$found"
    return 0
  fi
  printf '%s\n' "$app_dir/\\悠聊数据库\\config\\YouChatConfig.json"
}

backup_config_file() {
  cfg="$1"
  reason="$2"
  [ -e "$cfg" ] || return 0
  stamp="$(date +%Y%m%d-%H%M%S)"
  backup_dir="$control_dir/config-backups/${reason}-${stamp}"
  mkdir -p "$backup_dir"
  cp -a "$cfg" "$backup_dir/YouChatConfig.json.before" 2>/dev/null || true
}

build_mysql_connection_string() {
  if [ -n "${YOUCHAT_DB_CONNECTION_STRING:-}" ]; then
    ensure_mysql_connection_string_options "$YOUCHAT_DB_CONNECTION_STRING"
    return 0
  fi

  db_host="${YOUCHAT_DB_HOST:-mysql}"
  db_port="${YOUCHAT_DB_PORT:-3306}"
  db_name="${YOUCHAT_DB_NAME:-1556504756803862529}"
  db_user="${YOUCHAT_DB_USERNAME:-yz}"
  db_password="${YOUCHAT_DB_PASSWORD:-${MYSQL_YZ_PASSWORD:-}}"
  db_ssl_mode="${YOUCHAT_DB_SSL_MODE:-None}"

  if [ -z "$db_host" ] || [ -z "$db_name" ] || [ -z "$db_user" ] || [ -z "$db_password" ]; then
    return 1
  fi
  case "$db_host$db_port$db_name$db_user$db_password$db_ssl_mode" in
    *";"*) return 1 ;;
  esac

  printf 'Server=%s;Port=%s;Database=%s;User ID=%s;Password=%s;CharSet=utf8mb4;SslMode=%s;AllowPublicKeyRetrieval=True;Allow User Variables=true;\n' \
    "$db_host" "$db_port" "$db_name" "$db_user" "$db_password" "$db_ssl_mode"
}

ensure_mysql_connection_string_options() {
  conn="$1"
  conn="${conn%;}"
  printf '%s\n' "$conn" | grep -Eiq 'AllowPublicKeyRetrieval[[:space:]]*=[[:space:]]*True' || conn="${conn};AllowPublicKeyRetrieval=True"
  printf '%s\n' "$conn" | grep -Eiq 'Allow User Variables[[:space:]]*=' || conn="${conn};Allow User Variables=true"
  printf '%s;\n' "$conn"
}

is_mysql_config() {
  cfg="$1"
  [ -s "$cfg" ] || return 1
  grep -Eq '"DataBaseOptions"|"dataBaseOptions"' "$cfg" || return 1
  grep -Eq '"DatabaseType"[[:space:]]*:[[:space:]]*0|"databaseType"[[:space:]]*:[[:space:]]*0' "$cfg" || return 1
  grep -Eq '"ConnectionString"|"connectionString"' "$cfg" || return 1
  grep -Eiq 'AllowPublicKeyRetrieval[[:space:]]*=[[:space:]]*True' "$cfg" || return 1
  return 0
}

auto_close_enabled() {
  cfg="$1"
  [ -s "$cfg" ] || return 1
  grep -Eq '"AutoShutDown"[[:space:]]*:[[:space:]]*true|"autoShutDown"[[:space:]]*:[[:space:]]*true' "$cfg"
}

disable_auto_close() {
  cfg="$1"
  tmp="$cfg.tmp.$$"
  sed -E \
    -e 's/"AutoShutDown"[[:space:]]*:[[:space:]]*true/"AutoShutDown": false/g' \
    -e 's/"autoShutDown"[[:space:]]*:[[:space:]]*true/"autoShutDown": false/g' \
    "$cfg" > "$tmp" && mv "$tmp" "$cfg"
}

restore_latest_backup() {
  cfg="$1"
  latest="$(find "$control_dir/config-backups" -type f \( -name 'YouChatConfig.json.after' -o -name 'YouChatConfig.json.before' \) -size +0c -print 2>/dev/null | tail -n 1 || true)"
  if [ -n "$latest" ] && [ -s "$latest" ]; then
    cp -f "$latest" "$cfg"
    disable_auto_close "$cfg" || true
    log "restored config from backup"
    return 0
  fi
  return 1
}

write_mysql_config() {
  cfg="$1"
  conn="$2"
  tmp="$cfg.tmp.$$"
  cat > "$tmp" <<EOF
{
  "DataBaseOptions": {
    "DatabaseType": 0,
    "ConnectionString": "$conn"
  },
  "CommonOptions": {
    "AudioNotice": false,
    "AlertSysNotice": false,
    "ContactNameFilter": "c",
    "SwitchType": 0
  },
  "JobOptions": {
    "RunTimeoutCheckJob": true,
    "AutoShutDown": false,
    "Timeout": 5,
    "TimeoutNotice": true,
    "CloseTime": 20,
    "AutoScoreTime": 30,
    "IgnorRobotReply": true,
    "AutoInviteScore": false,
    "AutoLeaveMsg": false,
    "GetMsgByDate": 2
  },
  "AiOptions": {
    "IsOpen": false,
    "ConfigType": null,
    "ConfigValue": null,
    "Token": null
  }
}
EOF
  mv "$tmp" "$cfg"
}

repair_config() {
  load_env_file
  cfg="$(find_config_file)"
  mkdir -p "$(dirname "$cfg")" "$control_dir/config-backups"

  if [ "$mode" != "mysql" ]; then
    log "database mode is $mode; mysql repair skipped"
    return 0
  fi

  if is_mysql_config "$cfg"; then
    if auto_close_enabled "$cfg"; then
      backup_config_file "$cfg" "auto-close-off"
      disable_auto_close "$cfg" || true
      log "disabled AutoShutDown in existing config"
    else
      log "config is already safe"
    fi
    return 0
  fi

  backup_config_file "$cfg" "startup-invalid-config"
  conn="$(build_mysql_connection_string || true)"
  if [ -n "$conn" ]; then
    write_mysql_config "$cfg" "$conn"
    log "rewrote invalid config to MySQL mode"
    return 0
  fi

  if restore_latest_backup "$cfg"; then
    return 0
  fi

  log "unable to repair config: missing MySQL connection string and backup"
  return 1
}

repair_config "$@"
