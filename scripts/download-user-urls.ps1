# Script para download de imagens com URLs fornecidas pelo usuario
# Cada URL sera baixada e salva com o nome correto do arquivo

$imagesDir = "public\images\produtos"

# Criar diretorio se nao existir
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
}

# Mapeamento: URL -> Nome do arquivo (na ordem fornecida)
$imageMapping = @(
    @{
        url = "https://static.allianzparqueshop.com.br/produtos/tenis-puma-velocity-nitro-3-fade-wns-feminino/42/PI3-3854-042/PI3-3854-042_zoom1.jpg?ts=1766286633"
        filename = "puma-velocity-nitro-feminino.jpg"
    },
    @{
        url = "https://images.tcdn.com.br/img/img_prod/1393241/tenis_new_balance_9060_793_1_8a5f88f7101d4dd6101b64b84f5b69b1.jpg"
        filename = "new-balance-9060-masculino.jpg"
    },
    @{
        url = "https://www.amilcalcados.com.br/lojas/00046219/prod/064297-01.jpg"
        filename = "adidas-adilette-slide.jpg"
    },
    @{
        url = "https://oqvestir.fbitsstatic.net/img/p/tenis-masculino-speedcat-og-azul-229832/673120-7.jpg?w=1600&h=2133&v=202509042358"
        filename = "puma-speedcat-masculino.jpg"
    },
    @{
        url = "https://images.tcdn.com.br/img/img_prod/619492/chinelo_puma_slide_popcat_adulto_unissex_10505_variacao_72019_1_b9f1dc9073dd08f267020195638a3f5f.jpg"
        filename = "puma-slide-unissex.jpg"
    },
    @{
        url = "https://sunika.fbitsstatic.net/img/p/tenis-new-balance-x-teddy-santis-990-feminino-u990wo6-151999/346430.jpg?w=1000&h=1000&v=202509021133"
        filename = "new-balance-990-feminino.jpg"
    },
    @{
        url = "https://secure-static.vans.com.br/medias/sys_master/vans/vans/h3c/h6d/h00/h00/11541561999390/1002000560083U-01-BASEIMAGE-Midres.jpg"
        filename = "vans-slip-on-feminino.jpg"
    },
    @{
        url = "https://static.allianzparqueshop.com.br/produtos/tenis-mizuno-wave-rider-27-masculino/71/2FU-9697-471/2FU-9697-471_zoom1.jpg?ts=1763348286"
        filename = "mizuno-wave-rider-masculino.jpg"
    },
    @{
        url = "https://cdn.awsli.com.br/2500x2500/1058/1058679/produto/243086591c399f0b549.jpg"
        filename = "mizuno-wave-sky-feminino.jpg"
    },
    @{
        url = "https://grupooscar.vteximg.com.br/arquivos/ids/2649415/Nike-Meia-SX7676-964-BrancoCinzaPreto-Algodao--10-.jpg?v=638875950775430000"
        filename = "meias-nike-performance.jpg"
    },
    @{
        url = "https://shop2gether.fbitsstatic.net/img/p/kit-de-meia-masculina-3-stripes-cano-alto-3-pares-preto-240858/688108.jpg?w=1225&h=1633&v=202502251623"
        filename = "meias-adidas-originals.jpg"
    },
    @{
        url = "https://imgs.casasbahia.com.br/1571333707/1xg.jpg"
        filename = "cadarco-nike-laces.jpg"
    },
    @{
        url = "https://cdn.dooca.store/946/products/1-3963_1000x1320+fill_ffffff+crop_center.jpg?v=1675439340&webp=0"
        filename = "palmilha-nike-air-max.jpg"
    },
    @{
        url = "https://images.tcdn.com.br/img/img_prod/1151038/tenis_nike_air_max_ap_masculino_196032519_1_1ec661b994ab6bc5e6e4394fb06c3b6f.jpg"
        filename = "adidas-outlet-1.jpg"
    },
    @{
        url = "https://ostoresneakers.vteximg.com.br/arquivos/ids/223169-500-500/tenis-vans-ultrarange-exo-mte-marrom-VN000CWCY49C-0.jpg?v=638639126610700000"
        filename = "nike-outlet-1.jpg"
    },
    @{
        url = "https://ostoresneakers.vteximg.com.br/arquivos/ids/209727-500-500/0037117007-0-.jpg?v=637565969968770000"
        filename = "vans-outlet-1.jpg"
    },
    @{
        url = "https://lojasradan.vtexassets.com/arquivos/ids/436770-800-auto?v=638984839181830000&width=800&height=auto&aspect=true"
        filename = "puma-rs-x-masculino.jpg"
    },
    @{
        url = "https://lojavirus.fbitsstatic.net/img/p/tenis-vans-sk8-hi-waterproof-mte-black-vn000cvtblk-76061/321379.jpg?w=1200&h=1200&v=202501231556"
        filename = "new-balance-574-feminino.jpg"
    },
    @{
        url = "https://static.ativaesportes.com.br/public/ativaesportes/imagens/produtos/tenis-nike-revolution-6-next-nature-masculino-dc3728-012-653925ddd76f1.jpg"
        filename = "vans-sk8-hi-masculino.jpg"
    },
    @{
        url = "https://static.ativaesportes.com.br/public/ativaesportes/imagens/produtos/tenis-nike-revolution-6-next-nature-masculino-dc3728-012-653925ddd76f1.jpg"
        filename = "nike-revolution-6-masculino.jpg"
    },
    @{
        url = "https://static.super-shop.com/1466241-vans-shoes-knu-stack-sport-spice-light-pink.jpg?t=fb"
        filename = "vans-sherpa-feminino.jpg"
    },
    @{
        url = "https://static.saostore.com.br/produtos/tenis-new-balance-327-masculino/12/39U-1890-012/39U-1890-012_zoom1.jpg?ts=1766632401"
        filename = "new-balance-327-masculino.jpg"
    }
)

Write-Host "Iniciando download de imagens com URLs fornecidas..." -ForegroundColor Green
Write-Host "Total de imagens: $($imageMapping.Count)" -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$failCount = 0
$skippedCount = 0

# Headers para simular navegador
$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    "Accept" = "image/webp,image/apng,image/*,*/*;q=0.8"
    "Accept-Language" = "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
}

foreach ($item in $imageMapping) {
    $url = $item.url
    $filename = $item.filename
    $filePath = Join-Path $imagesDir $filename
    
    # Pular se ja existe
    if (Test-Path $filePath) {
        Write-Host "[$($imageMapping.IndexOf($item) + 1)/$($imageMapping.Count)] PULADO (ja existe): $filename" -ForegroundColor Cyan
        $skippedCount++
        continue
    }
    
    try {
        Write-Host "[$($imageMapping.IndexOf($item) + 1)/$($imageMapping.Count)] Baixando: $filename" -ForegroundColor Yellow
        
        $response = Invoke-WebRequest -Uri $url -Headers $headers -UseBasicParsing -ErrorAction Stop -TimeoutSec 30
        
        # Verificar se e realmente uma imagem
        $contentType = $response.Headers["Content-Type"]
        if ($contentType -and $contentType.StartsWith("image/")) {
            [System.IO.File]::WriteAllBytes($filePath, $response.Content)
            $fileSize = [math]::Round((Get-Item $filePath).Length / 1KB, 2)
            Write-Host "  OK: $filename baixado com sucesso ($fileSize KB)" -ForegroundColor Green
            $successCount++
        } else {
            throw "Resposta nao e uma imagem (Content-Type: $contentType)"
        }
    }
    catch {
        Write-Host "  ERRO ao baixar $filename : $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
    
    # Pequeno delay entre downloads
    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Download concluido!" -ForegroundColor Green
Write-Host "Sucesso: $successCount" -ForegroundColor Green
Write-Host "Pulados (ja existem): $skippedCount" -ForegroundColor Cyan
Write-Host "Falhas: $failCount" -ForegroundColor Red
Write-Host "Total processado: $($successCount + $skippedCount + $failCount)/$($imageMapping.Count)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
