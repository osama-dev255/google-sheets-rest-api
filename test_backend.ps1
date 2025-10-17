# PowerShell script to test backend deployment
Write-Host "🚀 TESTING BACKEND DEPLOYMENT STATUS" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

$BACKEND_URL = "https://google-sheets-rest-api-production.up.railway.app"

# Test root endpoint
Write-Host "`n1. Testing Root Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BACKEND_URL/" -TimeoutSec 15
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Content: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test health endpoint
Write-Host "`n2. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BACKEND_URL/health" -TimeoutSec 15
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Content: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test metadata endpoint
Write-Host "`n3. Testing Metadata Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BACKEND_URL/api/v1/sheets/metadata" -TimeoutSec 15
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Content: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ BACKEND TESTS COMPLETED" -ForegroundColor Green
Write-Host "If you see responses above, your backend is accessible!" -ForegroundColor Cyan