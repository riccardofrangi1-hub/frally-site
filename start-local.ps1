$port = 5500
Write-Host "Avvio server locale su http://localhost:$port" -ForegroundColor Cyan
python -m http.server $port
