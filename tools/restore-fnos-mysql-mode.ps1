param(
  [string]$ApiBase = "http://127.0.0.1:18080/api",
  [string]$ConnectionString = $env:YOUCHAT_MYSQL_CONNECTION_STRING,
  [int]$TimeoutSeconds = 15
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param(
    [string]$Name,
    [string]$Detail = ""
  )

  $line = "[STEP] $Name"
  if ($Detail) { $line = "$line - $Detail" }
  Write-Host $line -ForegroundColor Cyan
}

function Write-Check {
  param(
    [string]$Name,
    [bool]$Ok,
    [string]$Detail = ""
  )

  $status = if ($Ok) { "OK" } else { "FAIL" }
  $line = "[{0}] {1}" -f $status, $Name
  if ($Detail) { $line = "{0} - {1}" -f $line, $Detail }

  if ($Ok) {
    Write-Host $line -ForegroundColor Green
  } else {
    Write-Host $line -ForegroundColor Red
  }
}

function Invoke-YouChatApi {
  param(
    [string]$Path,
    [hashtable]$Body = @{}
  )

  $uri = ("{0}/{1}" -f $ApiBase.TrimEnd("/"), $Path.TrimStart("/"))
  Invoke-RestMethod `
    -Method Post `
    -Uri $uri `
    -Body $Body `
    -ContentType "application/x-www-form-urlencoded" `
    -TimeoutSec $TimeoutSeconds
}

Write-Step "Probe current database mode"
$before = Invoke-YouChatApi -Path "/System/GetOptions"
$beforeDbType = [int]$before.data.dataBaseOptions.databaseType
Write-Check "Before restore" ($true) ("databaseType={0}" -f $beforeDbType)

Write-Step "Test MySQL connection" "ConnectDatabase"
$connectResult = Invoke-YouChatApi -Path "/System/ConnectDatabase" -Body @{
  type = 0
  connectionString = $ConnectionString
}
if (-not $connectResult.success -or -not $connectResult.data) {
  throw "ConnectDatabase failed: $($connectResult.message)"
}
Write-Check "ConnectDatabase" $true

Write-Step "Persist MySQL mode" "SetConnectionString"
$saveResult = Invoke-YouChatApi -Path "/System/SetConnectionString" -Body @{
  type = 0
  connectionString = $ConnectionString
}
if (-not $saveResult.success -or -not $saveResult.data) {
  throw "SetConnectionString failed: $($saveResult.message)"
}
Write-Check "SetConnectionString" $true

Write-Step "Verify persisted mode"
$persisted = Invoke-YouChatApi -Path "/System/GetConnectionString"
$persistedType = [int]$persisted.data.databaseType
$persistedConn = [string]$persisted.data.connectionString
Write-Check "Persisted database mode" ($persistedType -eq 0) ("databaseType={0}" -f $persistedType)
Write-Check "Persisted connection string" ($persistedConn -like "Server=mysql*") ($persistedConn)

Write-Step "Verify runtime options"
$after = Invoke-YouChatApi -Path "/System/GetOptions"
$afterDbType = [int]$after.data.dataBaseOptions.databaseType
$afterConn = [string]$after.data.dataBaseOptions.connectionString
Write-Check "Runtime database mode" ($afterDbType -eq 0) ("databaseType={0}" -f $afterDbType)
Write-Check "Runtime connection string" ($afterConn -like "Server=mysql*") ($afterConn)

if ($afterDbType -ne 0) {
  throw "FnOS YouChat is still not in MySQL mode after SetConnectionString."
}

Write-Host ""
Write-Host "Restore summary:" -ForegroundColor Yellow
[ordered]@{
  apiBase = $ApiBase
  beforeDatabaseType = $beforeDbType
  afterDatabaseType = $afterDbType
  persistedDatabaseType = $persistedType
  connectionString = $afterConn
} | ConvertTo-Json -Depth 4
