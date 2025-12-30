# Script para baixar imagens dos produtos automaticamente
# Execute: .\download-images.ps1

$productsFile = "data/products.json"
$imagesDir = "public/images/produtos"

if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Force -Path $imagesDir | Out-Null
    Write-Host "Diretorio criado: $imagesDir" -ForegroundColor Green
}

function Download-ProductImage {
    param(
        [string]$Url,
        [string]$ProductSlug,
        [int]$ImageIndex
    )
    
    $extension = [System.IO.Path]::GetExtension($Url).Split('?')[0]
    if ([string]::IsNullOrEmpty($extension)) {
        $extension = ".jpg"
    }
    $fileName = "$ProductSlug-$($ImageIndex + 1)$extension"
    $filePath = Join-Path $imagesDir $fileName
    
    if (Test-Path $filePath) {
        Write-Host "  Imagem ja existe: $fileName" -ForegroundColor Yellow
        return $filePath
    }
    
    try {
        $webClient = New-Object System.Net.WebClient
        $webClient.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        $webClient.DownloadFile($Url, $filePath)
        $webClient.Dispose()
        Write-Host "  Baixado: $fileName" -ForegroundColor Green
        return $filePath
    }
    catch {
        Write-Host "  Erro ao baixar $fileName : $_" -ForegroundColor Red
        return $null
    }
}

Write-Host "Lendo arquivo de produtos..." -ForegroundColor Cyan
try {
    $productsJson = Get-Content $productsFile -Raw -Encoding UTF8 | ConvertFrom-Json
    Write-Host "Encontrados $($productsJson.Count) produtos" -ForegroundColor Green
}
catch {
    Write-Host "Erro ao ler arquivo JSON: $_" -ForegroundColor Red
    exit 1
}

$totalImages = 0
$downloadedImages = 0
$skippedImages = 0
$errorImages = 0
$updatedProducts = @()

foreach ($product in $productsJson) {
    $productName = $product.name
    $productSlug = $product.slug
    $images = $product.images
    
    if ($images -and $images.Count -gt 0) {
        Write-Host ""
        Write-Host "Processando: $productName" -ForegroundColor Cyan
        Write-Host "  Slug: $productSlug" -ForegroundColor Gray
        
        $updatedImages = @()
        
        for ($i = 0; $i -lt $images.Count; $i++) {
            $imageUrl = $images[$i]
            $totalImages++
            
            if ($imageUrl -match "^https?://") {
                $result = Download-ProductImage -Url $imageUrl -ProductSlug $productSlug -ImageIndex $i
                if ($result) {
                    $downloadedImages++
                    $urlParts = $imageUrl.Split('?')[0].Split('.')
                    $extension = if ($urlParts.Count -gt 1) { ".$($urlParts[$urlParts.Count - 1])" } else { ".jpg" }
                    $updatedImages += "/images/produtos/$productSlug-$($i + 1)$extension"
                } else {
                    $errorImages++
                    $updatedImages += $imageUrl
                }
            } else {
                Write-Host "  Ja e caminho local: $imageUrl" -ForegroundColor Yellow
                $updatedImages += $imageUrl
                $skippedImages++
            }
        }
        
        $product.images = $updatedImages
    }
    
    $updatedProducts += $product
}

Write-Host ""
Write-Host "Salvando arquivo JSON atualizado..." -ForegroundColor Cyan
try {
    $updatedProducts | ConvertTo-Json -Depth 10 | Set-Content $productsFile -Encoding UTF8
    Write-Host "JSON atualizado com sucesso" -ForegroundColor Green
}
catch {
    Write-Host "Erro ao salvar JSON: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "RESUMO DO DOWNLOAD" -ForegroundColor Cyan
Write-Host "Total de imagens processadas: $totalImages" -ForegroundColor White
Write-Host "Imagens baixadas: $downloadedImages" -ForegroundColor Green
Write-Host "Imagens ja existentes: $skippedImages" -ForegroundColor Yellow
Write-Host "Erros: $errorImages" -ForegroundColor $(if ($errorImages -gt 0) { "Red" } else { "Green" })
