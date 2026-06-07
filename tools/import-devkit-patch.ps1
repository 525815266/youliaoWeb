param(
  [Parameter(Mandatory = $true)]
  [string]$PatchZip,

  [Parameter(Mandatory = $true)]
  [string]$TargetPath,

  [switch]$Force
)

$ErrorActionPreference = "Stop"

function Get-Sha256OrNull {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) { return $null }
  return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant()
}

$PatchZip = (Resolve-Path -LiteralPath $PatchZip).Path
$targetItem = New-Item -ItemType Directory -Path $TargetPath -Force
$TargetPath = $targetItem.FullName

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) "youchat-devkit-import-$stamp-$PID"
$backupRoot = Join-Path $TargetPath ".youchat-patch-backups\$stamp"

try {
  Expand-Archive -LiteralPath $PatchZip -DestinationPath $tempRoot -Force

  $payloadRoot = Join-Path $tempRoot "payload"
  $manifestPath = Join-Path $tempRoot "youchat-devkit-manifest.json"
  if (-not (Test-Path -LiteralPath $payloadRoot)) {
    throw "Patch zip is missing payload folder."
  }
  if (-not (Test-Path -LiteralPath $manifestPath)) {
    throw "Patch zip is missing youchat-devkit-manifest.json."
  }

  $manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
  if ($manifest.name -ne "youchat-dev-web-portable-patch") {
    throw "Patch manifest name is not recognized: $($manifest.name)"
  }

  $payloadFiles = Get-ChildItem -LiteralPath $payloadRoot -Recurse -File | Sort-Object FullName
  if (-not $payloadFiles.Count) {
    throw "Patch payload has no files."
  }

  $changes = New-Object System.Collections.Generic.List[object]
  New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null

  foreach ($file in $payloadFiles) {
    $relative = $file.FullName.Substring($payloadRoot.Length + 1)
    $target = Join-Path $TargetPath $relative
    $targetParent = Split-Path -Parent $target
    New-Item -ItemType Directory -Path $targetParent -Force | Out-Null

    $existed = Test-Path -LiteralPath $target
    $beforeHash = if ($existed) { Get-Sha256OrNull $target } else { $null }
    $incomingHash = Get-Sha256OrNull $file.FullName

    if ($existed -and $beforeHash -eq $incomingHash) {
      $changes.Add([ordered]@{
        path = $relative.Replace("\", "/")
        action = "unchanged"
        beforeSha256 = $beforeHash
        afterSha256 = $incomingHash
      })
      continue
    }

    if ($existed) {
      $backup = Join-Path $backupRoot $relative
      $backupParent = Split-Path -Parent $backup
      New-Item -ItemType Directory -Path $backupParent -Force | Out-Null
      Copy-Item -LiteralPath $target -Destination $backup -Force
    }

    Copy-Item -LiteralPath $file.FullName -Destination $target -Force
    $changes.Add([ordered]@{
      path = $relative.Replace("\", "/")
      action = if ($existed) { "updated" } else { "created" }
      beforeSha256 = $beforeHash
      afterSha256 = $incomingHash
    })
  }

  $report = [ordered]@{
    importedAt = (Get-Date).ToUniversalTime().ToString("o")
    patchZip = $PatchZip
    targetPath = $TargetPath
    backupPath = $backupRoot
    manifestGeneratedAt = $manifest.generatedAt
    changes = $changes
  }

  $reportPath = Join-Path $backupRoot "import-report.json"
  $report | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $reportPath -Encoding UTF8

  $updated = ($changes | Where-Object { $_.action -eq "updated" }).Count
  $created = ($changes | Where-Object { $_.action -eq "created" }).Count
  $unchanged = ($changes | Where-Object { $_.action -eq "unchanged" }).Count

  Write-Host "Patch imported into:" $TargetPath
  Write-Host "Created:" $created "Updated:" $updated "Unchanged:" $unchanged
  Write-Host "Backup/report:" $backupRoot
  if (-not $Force) {
    Write-Host "Next: run npm run check from the target path if Node is available."
  }
} finally {
  if (Test-Path -LiteralPath $tempRoot) {
    $resolvedTemp = (Resolve-Path -LiteralPath $tempRoot).Path
    $tempBase = [System.IO.Path]::GetTempPath()
    if ($resolvedTemp.StartsWith($tempBase, [System.StringComparison]::OrdinalIgnoreCase)) {
      Remove-Item -LiteralPath $resolvedTemp -Recurse -Force
    }
  }
}
