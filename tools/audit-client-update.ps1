param(
  [string]$ClientRoot = "C:\Program Files\youchat-desktop",
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [string]$OutDir = ""
)

$ErrorActionPreference = "Stop"

function Get-Sha256OrNull {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) { return $null }
  return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant()
}

function Get-FileAudit {
  param([string]$Path)
  $exists = Test-Path -LiteralPath $Path
  $item = if ($exists) { Get-Item -LiteralPath $Path } else { $null }
  [ordered]@{
    path = $Path
    exists = [bool]$exists
    bytes = if ($item) { [int64]$item.Length } else { $null }
    sha256 = if ($item) { Get-Sha256OrNull $item.FullName } else { $null }
    lastWriteTime = if ($item) { $item.LastWriteTime.ToString("s") } else { $null }
  }
}

function Get-EndpointCandidates {
  param([string]$Root)
  if (-not (Test-Path -LiteralPath $Root)) { return @() }
  $matches = Get-ChildItem -LiteralPath $Root -Recurse -File -Include *.js,*.xml -ErrorAction SilentlyContinue |
    Select-String -Pattern '"/[A-Za-z0-9_]+/[A-Za-z0-9_]+"' -AllMatches -ErrorAction SilentlyContinue |
    ForEach-Object {
      foreach ($match in $_.Matches) {
        $match.Value.Trim('"')
      }
    }
  return $matches | Sort-Object -Unique
}

function Find-BraftCss {
  param([string]$Wwwroot)
  if (-not (Test-Path -LiteralPath $Wwwroot)) { return $null }
  Get-ChildItem -LiteralPath $Wwwroot -Filter "*.css" -File -ErrorAction SilentlyContinue |
    Where-Object { Select-String -LiteralPath $_.FullName -Pattern "braft-icons" -Quiet } |
    Select-Object -First 1
}

$ClientRoot = (Resolve-Path -LiteralPath $ClientRoot).Path
$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
if (-not $OutDir) { $OutDir = Join-Path $ProjectRoot "reports" }
$OutDir = (New-Item -ItemType Directory -Path $OutDir -Force).FullName

$wwwroot = Join-Path $ClientRoot "wwwroot"
$serviceXml = Join-Path $ClientRoot "bin\YouChatService.xml"
$braftCss = Find-BraftCss $wwwroot
$emoji = Get-ChildItem -LiteralPath (Join-Path $wwwroot "static") -Filter "emojiSource*.png" -File -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1

$endpoints = Get-EndpointCandidates $ClientRoot
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$jsonPath = Join-Path $OutDir "client-update-audit-$stamp.json"
$mdPath = Join-Path $OutDir "client-update-audit-$stamp.md"

$audit = [ordered]@{
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
  clientRoot = $ClientRoot
  files = [ordered]@{
    iconfontCss = Get-FileAudit (Join-Path $wwwroot "fontIcon\iconfont.css")
    iconfontWoff2 = Get-FileAudit (Join-Path $wwwroot "fontIcon\iconfont.woff2")
    braftCss = if ($braftCss) { Get-FileAudit $braftCss.FullName } else { [ordered]@{ path = ""; exists = $false; bytes = $null; sha256 = $null; lastWriteTime = $null } }
    emojiSprite = if ($emoji) { Get-FileAudit $emoji.FullName } else { Get-FileAudit (Join-Path $wwwroot "static\emojiSource.cdbf96da.png") }
    serviceXml = Get-FileAudit $serviceXml
  }
  endpointCount = $endpoints.Count
  endpoints = $endpoints
}

$audit | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $jsonPath -Encoding UTF8

$endpointPreview = if ($endpoints.Count) {
  $lines = $endpoints | Select-Object -First 80 | ForEach-Object { "- " + $_ }
  $lines -join [Environment]::NewLine
} else {
  "- No endpoint-like strings found."
}

$mdLines = @(
  "# YouChat Client Update Audit",
  "",
  "Generated at: $($audit.generatedAt)",
  "",
  "Client root: $ClientRoot",
  "",
  "## Key Files",
  "",
  "| File | Exists | Bytes | SHA256 |",
  "|---|---:|---:|---|",
  "| iconfont.css | $($audit.files.iconfontCss.exists) | $($audit.files.iconfontCss.bytes) | $($audit.files.iconfontCss.sha256) |",
  "| iconfont.woff2 | $($audit.files.iconfontWoff2.exists) | $($audit.files.iconfontWoff2.bytes) | $($audit.files.iconfontWoff2.sha256) |",
  "| braft css | $($audit.files.braftCss.exists) | $($audit.files.braftCss.bytes) | $($audit.files.braftCss.sha256) |",
  "| emoji sprite | $($audit.files.emojiSprite.exists) | $($audit.files.emojiSprite.bytes) | $($audit.files.emojiSprite.sha256) |",
  "| YouChatService.xml | $($audit.files.serviceXml.exists) | $($audit.files.serviceXml.bytes) | $($audit.files.serviceXml.sha256) |",
  "",
  "## Endpoint Candidates",
  "",
  "Found $($endpoints.Count) endpoint-like strings. First 80:",
  "",
  $endpointPreview,
  "",
  "## Review Checklist",
  "",
  "1. If iconfont.css or the Braft CSS hash changed, re-check glyph mappings in public/styles.css.",
  "2. If the emoji sprite hash changed, re-check the red packet sprite position.",
  "3. If YouChatService.xml or endpoint candidates changed, compare logs/api-capture.ndjson, HAR files, and frontend API params.",
  "4. After review, run tools/export-devkit-patch.ps1 to export a fresh portable patch."
)

$mdLines | Set-Content -LiteralPath $mdPath -Encoding UTF8

Write-Host "Client audit written:"
Write-Host $jsonPath
Write-Host $mdPath
Write-Host "Endpoint candidates:" $endpoints.Count
