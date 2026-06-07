$env:ASPNETCORE_URLS = "http://127.0.0.1:8080"
$serviceDir = "C:\Program Files\youchat-desktop\bin"
$serviceExe = Join-Path $serviceDir "YouChatService.exe"

Start-Process -FilePath $serviceExe -WorkingDirectory $serviceDir -WindowStyle Hidden
Write-Host "YouChatService requested on http://127.0.0.1:8080"
