# Script para executar teste do Lighthouse
# Uso: Execute este script APÓS iniciar o servidor (npm start)

Write-Host "`n=== TESTE DO LIGHTHOUSE - Pé Quente Calçados ===`n" -ForegroundColor Cyan

# Verificar se o servidor está rodando
$response = $null
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
    Write-Host "✓ Servidor detectado em http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "✗ Servidor não está rodando!" -ForegroundColor Red
    Write-Host "`nPor favor, execute primeiro:" -ForegroundColor Yellow
    Write-Host "  1. npm run build" -ForegroundColor White
    Write-Host "  2. npm start" -ForegroundColor White
    Write-Host "  3. Depois execute este script novamente`n" -ForegroundColor White
    exit 1
}

# Executar Lighthouse
Write-Host "`nExecutando análise do Lighthouse..." -ForegroundColor Yellow
Write-Host "Isso pode levar 30-60 segundos...`n" -ForegroundColor Gray

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$jsonReport = "lighthouse-report-$timestamp.json"
$htmlReport = "lighthouse-report-$timestamp.html"

npx lighthouse http://localhost:3000 `
    --only-categories=performance,accessibility,seo,best-practices `
    --output=json,html `
    --output-path=./lighthouse-reports/$timestamp `
    --chrome-flags="--headless" `
    --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Teste concluído com sucesso!`n" -ForegroundColor Green
    
    # Tentar ler e exibir resultados resumidos
    if (Test-Path "lighthouse-reports/$timestamp.report.json") {
        $report = Get-Content "lighthouse-reports/$timestamp.report.json" | ConvertFrom-Json
        
        Write-Host "=== RESULTADOS ===" -ForegroundColor Cyan
        Write-Host "Performance: $([math]::Round($report.categories.performance.score * 100))/100" -ForegroundColor $(if ($report.categories.performance.score -ge 0.95) { "Green" } else { "Yellow" })
        Write-Host "Acessibilidade: $([math]::Round($report.categories.accessibility.score * 100))/100" -ForegroundColor $(if ($report.categories.accessibility.score -eq 1) { "Green" } else { "Yellow" })
        Write-Host "SEO: $([math]::Round($report.categories.seo.score * 100))/100" -ForegroundColor $(if ($report.categories.seo.score -eq 1) { "Green" } else { "Yellow" })
        if ($report.categories.'best-practices') {
            Write-Host "Best Practices: $([math]::Round($report.categories.'best-practices'.score * 100))/100" -ForegroundColor $(if ($report.categories.'best-practices'.score -ge 0.9) { "Green" } else { "Yellow" })
        }
        Write-Host ""
        
        Write-Host "Relatórios salvos em:" -ForegroundColor Cyan
        Write-Host "  JSON: lighthouse-reports/$timestamp.report.json" -ForegroundColor White
        Write-Host "  HTML: lighthouse-reports/$timestamp.report.html" -ForegroundColor White
        Write-Host ""
        Write-Host "Para ver o relatório HTML completo, abra o arquivo HTML no navegador.`n" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n✗ Erro ao executar o Lighthouse" -ForegroundColor Red
    Write-Host "Verifique se o servidor está rodando e tente novamente.`n" -ForegroundColor Yellow
}
