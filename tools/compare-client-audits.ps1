param(
  [string]$OldAudit = "",
  [string]$NewAudit = "",
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [string]$OutDir = ""
)

$ErrorActionPreference = "Stop"

function Get-UniqueStrings {
  param([object[]]$Items)
  $set = @{}
  foreach ($item in @($Items)) {
    if ($null -eq $item) { continue }
    $value = [string]$item
    if (-not $value) { continue }
    $set[$value] = $true
  }
  return @($set.Keys | Sort-Object)
}

function Get-AddedItems {
  param(
    [string[]]$OldItems,
    [string[]]$NewItems
  )
  $oldSet = @{}
  foreach ($item in @($OldItems)) { $oldSet[$item] = $true }
  return @($NewItems | Where-Object { -not $oldSet.ContainsKey($_) } | Sort-Object)
}

function Get-RemovedItems {
  param(
    [string[]]$OldItems,
    [string[]]$NewItems
  )
  $newSet = @{}
  foreach ($item in @($NewItems)) { $newSet[$item] = $true }
  return @($OldItems | Where-Object { -not $newSet.ContainsKey($_) } | Sort-Object)
}

function Get-FileMap {
  param([object]$Audit)
  $map = @{}
  if ($null -eq $Audit.files) { return $map }
  foreach ($prop in $Audit.files.PSObject.Properties) {
    $map[$prop.Name] = $prop.Value
  }
  return $map
}

function Resolve-AuditInput {
  param([string]$Path)
  if (-not $Path) { return "" }
  return (Resolve-Path -LiteralPath $Path).Path
}

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
if (-not $OutDir) { $OutDir = Join-Path $ProjectRoot "reports" }
$OutDir = (New-Item -ItemType Directory -Path $OutDir -Force).FullName

$reportFiles = @(Get-ChildItem -LiteralPath $OutDir -Filter "client-update-audit-*.json" -File -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending)

if (-not $NewAudit) {
  if ($reportFiles.Count -lt 1) {
    throw "No client audit JSON files found. Run tools/audit-client-update.ps1 first."
  }
  $NewAudit = $reportFiles[0].FullName
}

if (-not $OldAudit) {
  if ($reportFiles.Count -ge 2) {
    $OldAudit = $reportFiles[1].FullName
  } else {
    $OldAudit = $NewAudit
  }
}

$OldAudit = Resolve-AuditInput $OldAudit
$NewAudit = Resolve-AuditInput $NewAudit

$old = Get-Content -LiteralPath $OldAudit -Raw -Encoding UTF8 | ConvertFrom-Json
$new = Get-Content -LiteralPath $NewAudit -Raw -Encoding UTF8 | ConvertFrom-Json

$oldEndpoints = Get-UniqueStrings @($old.endpoints)
$newEndpoints = Get-UniqueStrings @($new.endpoints)
$addedEndpoints = Get-AddedItems -OldItems $oldEndpoints -NewItems $newEndpoints
$removedEndpoints = Get-RemovedItems -OldItems $oldEndpoints -NewItems $newEndpoints

$oldFiles = Get-FileMap $old
$newFiles = Get-FileMap $new
$fileKeys = Get-UniqueStrings @($oldFiles.Keys + $newFiles.Keys)
$fileChanges = New-Object System.Collections.Generic.List[object]

foreach ($key in $fileKeys) {
  $oldFile = if ($oldFiles.ContainsKey($key)) { $oldFiles[$key] } else { $null }
  $newFile = if ($newFiles.ContainsKey($key)) { $newFiles[$key] } else { $null }

  $oldExists = if ($oldFile) { [bool]$oldFile.exists } else { $false }
  $newExists = if ($newFile) { [bool]$newFile.exists } else { $false }
  $oldBytes = if ($oldFile) { $oldFile.bytes } else { $null }
  $newBytes = if ($newFile) { $newFile.bytes } else { $null }
  $oldSha = if ($oldFile) { $oldFile.sha256 } else { $null }
  $newSha = if ($newFile) { $newFile.sha256 } else { $null }

  if (($oldExists -ne $newExists) -or ($oldBytes -ne $newBytes) -or ($oldSha -ne $newSha)) {
    $fileChanges.Add([ordered]@{
      key = $key
      oldExists = $oldExists
      newExists = $newExists
      oldBytes = $oldBytes
      newBytes = $newBytes
      oldSha256 = $oldSha
      newSha256 = $newSha
      oldPath = if ($oldFile) { $oldFile.path } else { "" }
      newPath = if ($newFile) { $newFile.path } else { "" }
    })
  }
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$jsonPath = Join-Path $OutDir "client-audit-compare-$stamp.json"
$mdPath = Join-Path $OutDir "client-audit-compare-$stamp.md"

$compare = [ordered]@{
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
  oldAudit = $OldAudit
  newAudit = $NewAudit
  oldGeneratedAt = $old.generatedAt
  newGeneratedAt = $new.generatedAt
  fileChanges = $fileChanges
  endpointsAdded = $addedEndpoints
  endpointsRemoved = $removedEndpoints
  hasChanges = ($fileChanges.Count -gt 0 -or $addedEndpoints.Count -gt 0 -or $removedEndpoints.Count -gt 0)
}

$compare | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $jsonPath -Encoding UTF8

$fileSection = if ($fileChanges.Count) {
  $rows = $fileChanges | ForEach-Object {
    "| $($_.key) | $($_.oldExists) | $($_.newExists) | $($_.oldBytes) | $($_.newBytes) | $($_.oldSha256) | $($_.newSha256) |"
  }
  @(
    "| Key | Old exists | New exists | Old bytes | New bytes | Old SHA256 | New SHA256 |",
    "|---|---:|---:|---:|---:|---|---|"
  ) + $rows
} else {
  @("- No key file fingerprint changes.")
}

$addedSection = if ($addedEndpoints.Count) {
  $addedEndpoints | ForEach-Object { "- " + $_ }
} else {
  @("- No endpoints added.")
}

$removedSection = if ($removedEndpoints.Count) {
  $removedEndpoints | ForEach-Object { "- " + $_ }
} else {
  @("- No endpoints removed.")
}

$mdLines = @(
  "# YouChat Client Audit Compare",
  "",
  "Generated at: $($compare.generatedAt)",
  "",
  "Old audit: $OldAudit",
  "",
  "New audit: $NewAudit",
  "",
  "## Summary",
  "",
  "- File changes: $($fileChanges.Count)",
  "- Endpoints added: $($addedEndpoints.Count)",
  "- Endpoints removed: $($removedEndpoints.Count)",
  "- Has changes: $($compare.hasChanges)",
  "",
  "## Key File Changes",
  ""
) + $fileSection + @(
  "",
  "## Endpoints Added",
  ""
) + $addedSection + @(
  "",
  "## Endpoints Removed",
  ""
) + $removedSection + @(
  "",
  "## Review Notes",
  "",
  "1. If key file hashes changed, re-check native icons, emoji sprites, and service XML references.",
  "2. If endpoints changed, inspect captured traffic and update frontend API params before exporting a new patch.",
  "3. After fixes, update PROJECT_MEMORY.md, AI_HANDOFF.md, PATCH_GUIDE.md, then export a fresh patch."
)

$mdLines | Set-Content -LiteralPath $mdPath -Encoding UTF8

Write-Host "Client audit compare written:"
Write-Host $jsonPath
Write-Host $mdPath
Write-Host "File changes:" $fileChanges.Count
Write-Host "Endpoints added:" $addedEndpoints.Count
Write-Host "Endpoints removed:" $removedEndpoints.Count
