param(
  [int]$ListenPort = 18081,
  [string]$Target = "http://127.0.0.1:18080"
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "Starting YouChat client capture proxy..."
Write-Host "Listen: http://127.0.0.1:$ListenPort"
Write-Host "Target: $Target"
Write-Host "Log: $scriptDir\logs\client-proxy-capture.ndjson"
Write-Host ""
Write-Host "In the original Electron client, set server address to 127.0.0.1 and port to $ListenPort."
Write-Host "Press Ctrl+C to stop."

$env:CAPTURE_PORT = "$ListenPort"
$env:YOUCHAT_CAPTURE_TARGET = $Target
node .\capture-client-proxy.js
