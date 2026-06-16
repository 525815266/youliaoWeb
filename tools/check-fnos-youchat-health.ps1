param(
  [string]$ApiBase = "http://127.0.0.1:18080/api",
  [int]$MinHistoryCount = 1000,
  [int]$TimeoutSeconds = 10
)

$ErrorActionPreference = "Stop"

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

function Get-ContactCount {
  param([hashtable]$Body)

  $payload = Invoke-YouChatApi -Path "/Contact/GetContactList" -Body $Body
  if (-not $payload.success) {
    throw "GetContactList returned success=false: $($payload.message)"
  }

  $data = $payload.data
  if ($null -eq $data) { return 0 }
  if ($data -is [int] -or $data -is [long]) { return [int]$data }
  if ($null -ne $data.total) { return [int]$data.total }
  if ($null -ne $data.list) { return @($data.list).Count }
  return 0
}

$summary = [ordered]@{
  apiBase = $ApiBase
  databaseType = $null
  databaseMode = "unknown"
  totalContacts = $null
  historyContacts = $null
  guestbookContacts = $null
  currentAccount2 = $null
  ok = $true
}

try {
  $optionsPayload = Invoke-YouChatApi -Path "/System/GetOptions"
  $options = $optionsPayload.data
  $dbOptions = $options.dataBaseOptions
  $dbType = [int]$dbOptions.databaseType
  $summary.databaseType = $dbType
  $summary.databaseMode = switch ($dbType) {
    0 { "mysql" }
    1 { "sqlserver" }
    2 { "sqlite" }
    default { "unknown" }
  }

  Write-Check "System/GetOptions" $optionsPayload.success ("databaseType={0} ({1})" -f $dbType, $summary.databaseMode)
  if ($dbType -ne 0) {
    $summary.ok = $false
    Write-Check "Database mode should be MySQL" $false "FnOS service is not using MySQL. History/current counts may look wrong."
  } else {
    Write-Check "Database mode should be MySQL" $true
  }
} catch {
  $summary.ok = $false
  Write-Check "System/GetOptions" $false $_.Exception.Message
}

try {
  $summary.totalContacts = Get-ContactCount @{ pageIndex = 1; pageSize = 20 }
  Write-Check "Contact total" ($summary.totalContacts -gt 0) ("total={0}" -f $summary.totalContacts)
} catch {
  $summary.ok = $false
  Write-Check "Contact total" $false $_.Exception.Message
}

try {
  $summary.historyContacts = Get-ContactCount @{ pageIndex = 1; pageSize = 20; isHistory = "true" }
  $historyOk = $summary.historyContacts -ge $MinHistoryCount
  if (-not $historyOk) { $summary.ok = $false }
  Write-Check "History contacts" $historyOk ("total={0}, expected>={1}" -f $summary.historyContacts, $MinHistoryCount)
} catch {
  $summary.ok = $false
  Write-Check "History contacts" $false $_.Exception.Message
}

try {
  $summary.guestbookContacts = Get-ContactCount @{ pageIndex = 1; pageSize = 20; isGuestbook = "true" }
  Write-Check "Guestbook contacts" $true ("total={0}" -f $summary.guestbookContacts)
} catch {
  $summary.ok = $false
  Write-Check "Guestbook contacts" $false $_.Exception.Message
}

try {
  $summary.currentAccount2 = Get-ContactCount @{ pageIndex = 1; pageSize = 20; accountId = 2 }
  Write-Check "AccountId=2 current probe" $true ("total={0}" -f $summary.currentAccount2)
} catch {
  $summary.ok = $false
  Write-Check "AccountId=2 current probe" $false $_.Exception.Message
}

Write-Host ""
Write-Host "Summary JSON:"
$summary | ConvertTo-Json -Depth 4

if (-not $summary.ok) {
  Write-Host ""
  Write-Host "Recommended next checks:" -ForegroundColor Yellow
  Write-Host "- If databaseType=2, first run: npm run fnos:restore:mysql"
  Write-Host "- If databaseType=2 still remains after the restore script, switch YouChatConfig.json back to MySQL and restart youchat-service."
  Write-Host "- If databaseType=0 but chat/contact APIs fail, inspect MySQL ChatContent_* table collations and service logs."
  exit 1
}
