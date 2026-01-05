const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Ler o arquivo products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const publicImagesPath = path.join(__dirname, '..', 'public', 'images', 'produtos');

// Garantir que o diretório existe
if (!fs.existsSync(publicImagesPath)) {
  fs.mkdirSync(publicImagesPath, { recursive: true });
  console.log(`✓ Diretório criado: ${publicImagesPath}`);
}

// Ler produtos
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
console.log(`✓ ${products.length} produtos carregados\n`);

// Mapeamento de marcas para busca
const brandSearchMap = {
  'Fila': 'fila',
  'Olympikus': 'olympikus',
  'Asics': 'asics',
  'Umbro': 'umbro',
  'Kenner': 'kenner',
  'Ferracini': 'ferracini',
  'Under Armour': 'under-armour',
  'All Star': 'converse',
  'Penalty': 'penalty',
  'Nike': 'nike',
  'Adidas': 'adidas',
  'Puma': 'puma',
  'New Balance': 'new-balance',
  'Vans': 'vans',
  'Mizuno': 'mizuno'
};

// URLs de busca conhecidas (sites públicos com imagens)
const imageSearchSources = [
  // Placeholder service com imagens de produtos
  (brand, productName) => `https://via.placeholder.com/800x800/FFFFFF/000000?text=${encodeURIComponent(brand + ' ' + productName)}`,
];

// Função para normalizar nome do produto para busca
function normalizeProductName(productName) {
  return productName
    .toLowerCase()
    .replace(/tênis\s+/gi, '')
    .replace(/chinelo\s+/gi, '')
    .replace(/chuteira\s+/gi, '')
    .replace(/sapato\s+/gi, '')
    .replace(/mochila\s+/gi, '')
    .replace(/boné\s+/gi, '')
    .replace(/bola\s+/gi, '')
    .replace(/mala\s+/gi, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Função para baixar arquivo
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : http;
    
    const requestOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const request = protocol.get(url, requestOptions, (response) => {
      // Se for redirecionamento, seguir
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        return reject(new Error(`Erro ao baixar: ${response.statusCode}`));
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    });

    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });

    file.on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });

    request.setTimeout(30000, () => {
      request.abort();
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(new Error('Timeout ao baixar'));
    });
  });
}

// Função para criar placeholder usando API de placeholder (gera JPG real)
async function createPlaceholderJPG(brand, productName, filename) {
  // Usar serviço de placeholder que gera JPG real
  const text = encodeURIComponent(`${brand} ${productName.substring(0, 30)}`);
  const placeholderUrl = `https://placehold.co/800x800/FFFFFF/000000.jpg?text=${text}`;
  
  const filepath = path.join(publicImagesPath, filename);
  
  try {
    await downloadFile(placeholderUrl, filepath);
    return filepath;
  } catch (error) {
    // Se falhar, criar SVG como fallback
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#FFFFFF"/>
  <text x="400" y="350" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="#333333">${brand}</text>
  <text x="400" y="400" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#666666">${productName.substring(0, 40)}</text>
  <text x="400" y="450" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#999999">Imagem não disponível</text>
</svg>`;
    
    const svgPath = path.join(publicImagesPath, filename.replace('.jpg', '.svg'));
    fs.writeFileSync(svgPath, svg);
    return svgPath;
  }
}

// Função para tentar buscar imagem
async function searchAndDownloadImage(product, imagePath) {
  const filename = imagePath.split('/').pop();
  const filepath = path.join(publicImagesPath, filename);

  // Se já existe, pular
  if (fs.existsSync(filepath)) {
    return { success: true, method: 'exists', filename };
  }

  // Tentar múltiplas estratégias
  const strategies = [];

  // Estratégia 1: Tentar URLs conhecidas de imagens de produtos
  // (Aqui você pode adicionar URLs específicas se souber padrões)
  
  // Estratégia 2: Criar placeholder SVG (mais profissional que PNG placeholder)
  strategies.push(() => {
    try {
      const placeholderPath = createPlaceholderSVG(product.brand, product.name, filename);
      return { success: true, method: 'placeholder', filename: path.basename(placeholderPath) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Tentar estratégias em ordem
  for (const strategy of strategies) {
    try {
      const result = await strategy();
      if (result.success) {
        return result;
      }
    } catch (error) {
      continue;
    }
  }

  return { success: false, error: 'Nenhuma estratégia funcionou' };
}

// Processar produtos que precisam de imagens
async function processMissingImages() {
  const missingImages = [];
  
  // Encontrar produtos com imagens locais que não existem
  products.forEach((product) => {
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((imagePath) => {
        if (!imagePath.startsWith('http')) {
          const fullPath = path.join(__dirname, '..', 'public', imagePath);
          const filename = imagePath.split('/').pop();
          
          if (!fs.existsSync(fullPath)) {
            missingImages.push({
              product,
              imagePath,
              filename
            });
          }
        }
      });
    }
  });

  console.log(`📦 ${missingImages.length} imagens faltantes encontradas\n`);

  if (missingImages.length === 0) {
    console.log('✅ Todas as imagens já existem!');
    return;
  }

  console.log('🚀 Iniciando busca e criação de imagens...\n');

  let created = 0;
  let failed = 0;
  const failedImages = [];

  for (let i = 0; i < missingImages.length; i++) {
    const { product, filename } = missingImages[i];
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const result = await searchAndDownloadImage(product, missingImages[i].imagePath);
      
      if (result.success) {
        console.log(`✓ ${i + 1}/${missingImages.length} - Criado: ${result.filename} (${result.method})`);
        created++;
      } else {
        console.log(`✗ ${i + 1}/${missingImages.length} - Falha: ${filename}`);
        failed++;
        failedImages.push({ filename, product: product.name, error: result.error });
      }
    } catch (error) {
      console.log(`✗ ${i + 1}/${missingImages.length} - Erro: ${filename} - ${error.message}`);
      failed++;
      failedImages.push({ filename, product: product.name, error: error.message });
    }
  }

  // Resumo
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO');
  console.log('='.repeat(60));
  console.log(`✓ Criadas: ${created}`);
  console.log(`✗ Falhas: ${failed}`);

  if (failedImages.length > 0) {
    console.log('\n❌ Imagens com erro:');
    failedImages.forEach(({ filename, product, error }) => {
      console.log(`  - ${filename} (${product})`);
      console.log(`    Erro: ${error}\n`);
    });
  }

  console.log('\n💡 NOTA: Placeholders SVG foram criados.');
  console.log('   Para imagens reais, você pode:');
  console.log('   1. Baixar manualmente de sites de produtos');
  console.log('   2. Usar um script de web scraping (requer configuração)');
  console.log('   3. Substituir os arquivos SVG pelos JPGs reais\n');

  console.log('✅ Processo concluído!');
}

// Executar
processMissingImages().catch(console.error);
