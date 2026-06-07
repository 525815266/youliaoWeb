param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [string]$OutDir = "",
  [string]$ClientWwwroot = ""
)

$ErrorActionPreference = "Stop"

function Get-Sha256OrNull {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) { return $null }
  return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant()
}

function Get-FileFingerprint {
  param([string]$Path)
  $exists = Test-Path -LiteralPath $Path
  $item = if ($exists) { Get-Item -LiteralPath $Path } else { $null }
  return [ordered]@{
    path = $Path
    exists = [bool]$exists
    bytes = if ($item) { [int64]$item.Length } else { $null }
    sha256 = if ($item) { Get-Sha256OrNull $item.FullName } else { $null }
  }
}

function Copy-IntoPayload {
  param(
    [string]$SourceRoot,
    [string]$PayloadRoot,
    [string]$RelativePath
  )

  $source = Join-Path $SourceRoot $RelativePath
  if (-not (Test-Path -LiteralPath $source)) { return }
  $dest = Join-Path $PayloadRoot $RelativePath
  $parent = Split-Path -Parent $dest
  New-Item -ItemType Directory -Path $parent -Force | Out-Null
  Copy-Item -LiteralPath $source -Destination $dest -Recurse -Force
}

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
if (-not $OutDir) { $OutDir = Join-Path $ProjectRoot "patches" }
if (-not $ClientWwwroot) {
  $ClientWwwroot = if ($env:YOUCHAT_DESKTOP_WWWROOT) { $env:YOUCHAT_DESKTOP_WWWROOT } else { "C:\Program Files\youchat-desktop\wwwroot" }
}

$OutDir = (New-Item -ItemType Directory -Path $OutDir -Force).FullName
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) "youchat-devkit-export-$stamp-$PID"
$payloadRoot = Join-Path $tempRoot "payload"

try {
  New-Item -ItemType Directory -Path $payloadRoot -Force | Out-Null

  $includePaths = @(
    "package.json",
    "server.js",
    "README.md",
    "PRODUCT.md",
    "DESIGN.md",
    "PATCH_GUIDE.md",
    "PROJECT_MEMORY.md",
    "AI_HANDOFF.md",
    "start-dev-web.ps1",
    "start-local-youchat-service.ps1",
    "start-client-capture-proxy.ps1",
    "watch-api-capture.ps1",
    "capture-client-proxy.js",
    "public",
    "data",
    "tools"
  )

  foreach ($relative in $includePaths) {
    Copy-IntoPayload -SourceRoot $ProjectRoot -PayloadRoot $payloadRoot -RelativePath $relative
  }

  $payloadFiles = Get-ChildItem -LiteralPath $payloadRoot -Recurse -File | Sort-Object FullName | ForEach-Object {
    $relative = $_.FullName.Substring($payloadRoot.Length + 1).Replace("\", "/")
    [ordered]@{
      path = $relative
      bytes = [int64]$_.Length
      sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    }
  }

  $clientRootExists = Test-Path -LiteralPath $ClientWwwroot
  $braftCss = $null
  $emoji = $null
  $serviceXml = $null

  if ($clientRootExists) {
    $braftCss = Get-ChildItem -LiteralPath $ClientWwwroot -Filter "*.css" -File -ErrorAction SilentlyContinue |
      Where-Object { Select-String -LiteralPath $_.FullName -Pattern "braft-icons" -Quiet } |
      Select-Object -First 1
    $emoji = Get-ChildItem -LiteralPath (Join-Path $ClientWwwroot "static") -Filter "emojiSource*.png" -File -ErrorAction SilentlyContinue |
      Sort-Object LastWriteTime -Descending |
      Select-Object -First 1
    $clientRoot = Split-Path -Parent $ClientWwwroot
    $serviceCandidate = Join-Path $clientRoot "bin\YouChatService.xml"
    if (Test-Path -LiteralPath $serviceCandidate) { $serviceXml = Get-Item -LiteralPath $serviceCandidate }
  }

  $clientFingerprints = [ordered]@{
    clientWwwroot = $ClientWwwroot
    clientWwwrootExists = [bool]$clientRootExists
    iconfontCss = Get-FileFingerprint (Join-Path $ClientWwwroot "fontIcon\iconfont.css")
    iconfontWoff2 = Get-FileFingerprint (Join-Path $ClientWwwroot "fontIcon\iconfont.woff2")
    emojiSprite = if ($emoji) { Get-FileFingerprint $emoji.FullName } else { Get-FileFingerprint (Join-Path $ClientWwwroot "static\emojiSource.cdbf96da.png") }
    braftCss = if ($braftCss) { Get-FileFingerprint $braftCss.FullName } else { [ordered]@{ path = ""; exists = $false; bytes = $null; sha256 = $null } }
    serviceXml = if ($serviceXml) { Get-FileFingerprint $serviceXml.FullName } else { [ordered]@{ path = ""; exists = $false; bytes = $null; sha256 = $null } }
  }

  $manifest = [ordered]@{
    schemaVersion = 1
    name = "youchat-dev-web-portable-patch"
    generatedAt = (Get-Date).ToUniversalTime().ToString("o")
    sourceProjectRoot = $ProjectRoot
    files = $payloadFiles
    clientFingerprints = $clientFingerprints
    notes = @(
      "This zip is a portable overlay patch for the YouChat Web secondary-development workbench.",
      "Import with tools/import-devkit-patch.ps1. Existing target files are backed up before overwrite.",
      "After original Electron client updates, run tools/audit-client-update.ps1 before exporting a new patch."
    )
  }

  $manifestPath = Join-Path $tempRoot "youchat-devkit-manifest.json"
  $manifest | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

  $readme = @"
# YouChat Dev Web Portable Patch

Generated: $($manifest.generatedAt)

## Import

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\import-devkit-patch.ps1 -PatchZip <zip> -TargetPath <target>
```

The importer copies the `payload` folder into the target path and backs up overwritten files under `.youchat-patch-backups`.

## After Client Updates

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\audit-client-update.ps1 -ClientRoot "C:\Program Files\youchat-desktop"
```

Then review `reports/client-update-audit-*.md` before exporting a new patch.
"@
  $readme | Set-Content -LiteralPath (Join-Path $tempRoot "PATCH_README.md") -Encoding UTF8

  $zipPath = Join-Path $OutDir "youchat-dev-web-patch-$stamp.zip"
  Compress-Archive -Path (Join-Path $tempRoot "*") -DestinationPath $zipPath -Force

  Write-Host "Patch exported:" $zipPath
  Write-Host "Payload files:" $payloadFiles.Count
  Write-Host "Manifest:" $manifestPath
} finally {
  if (Test-Path -LiteralPath $tempRoot) {
    $resolvedTemp = (Resolve-Path -LiteralPath $tempRoot).Path
    $tempBase = [System.IO.Path]::GetTempPath()
    if ($resolvedTemp.StartsWith($tempBase, [System.StringComparison]::OrdinalIgnoreCase)) {
      Remove-Item -LiteralPath $resolvedTemp -Recurse -Force
    }
  }
}
