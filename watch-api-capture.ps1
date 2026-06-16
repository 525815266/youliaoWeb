$logFile = ".\logs\api-capture.ndjson"

if (-not (Test-Path -LiteralPath (Split-Path $logFile))) {
  New-Item -ItemType Directory -Path (Split-Path $logFile) | Out-Null
}

if (-not (Test-Path -LiteralPath $logFile)) {
  New-Item -ItemType File -Path $logFile | Out-Null
}

Write-Host "Watching $logFile"
Write-Host "Operate the Web page, then copy the newest lines or send this file back."
Get-Content -LiteralPath $logFile -Wait
