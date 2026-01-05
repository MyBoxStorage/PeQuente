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

// Função para baixar arquivo
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, (response) => {
      // Se for redirecionamento, seguir
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filepath);
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
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

// Extrair todas as imagens únicas
const imageMap = new Map();

products.forEach((product) => {
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((imagePath) => {
      // Se já existe no sistema de arquivos, pular
      if (!imagePath.startsWith('http')) {
        const fullPath = path.join(__dirname, '..', 'public', imagePath);
        if (fs.existsSync(fullPath)) {
          return; // Já existe, pular
        }
      }

      // Extrair nome do arquivo do caminho
      const filename = imagePath.split('/').pop();
      
      if (!imageMap.has(filename)) {
        imageMap.set(filename, {
          path: imagePath,
          needsDownload: imagePath.startsWith('http'),
          url: imagePath.startsWith('http') ? imagePath : null,
        });
      }
    });
  }
});

console.log(`📦 ${imageMap.size} imagens únicas encontradas\n`);

// Contadores
let downloaded = 0;
let skipped = 0;
let failed = 0;
const failedImages = [];

// Função para processar download com delay
async function downloadWithDelay(item, index, total, delay = 500) {
  const filename = item[0];
  const { path: imagePath, needsDownload, url } = item[1];

  if (!needsDownload) {
    const fullPath = path.join(__dirname, '..', 'public', imagePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠ ${index + 1}/${total} - Arquivo local não encontrado: ${filename}`);
      skipped++;
    } else {
      console.log(`✓ ${index + 1}/${total} - Arquivo local já existe: ${filename}`);
      skipped++;
    }
    return;
  }

  if (!url) {
    console.log(`⚠ ${index + 1}/${total} - Sem URL para download: ${filename}`);
    skipped++;
    return;
  }

  const filepath = path.join(publicImagesPath, filename);

  // Se já existe, pular
  if (fs.existsSync(filepath)) {
    console.log(`✓ ${index + 1}/${total} - Já existe: ${filename}`);
    skipped++;
    return;
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, delay));
    await downloadFile(url, filepath);
    console.log(`✓ ${index + 1}/${total} - Baixado: ${filename}`);
    downloaded++;
  } catch (error) {
    console.log(`✗ ${index + 1}/${total} - Erro ao baixar ${filename}: ${error.message}`);
    failed++;
    failedImages.push({ filename, url, error: error.message });
  }
}

// Processar todos os downloads
async function processDownloads() {
  const items = Array.from(imageMap.entries());
  const total = items.length;

  console.log('🚀 Iniciando downloads...\n');

  for (let i = 0; i < items.length; i++) {
    await downloadWithDelay(items[i], i, total, 300); // Delay de 300ms entre downloads
  }

  // Resumo
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO');
  console.log('='.repeat(60));
  console.log(`✓ Baixados: ${downloaded}`);
  console.log(`⊘ Ignorados (já existem): ${skipped}`);
  console.log(`✗ Falhas: ${failed}`);

  if (failedImages.length > 0) {
    console.log('\n❌ Imagens com erro:');
    failedImages.forEach(({ filename, url, error }) => {
      console.log(`  - ${filename}`);
      console.log(`    URL: ${url}`);
      console.log(`    Erro: ${error}\n`);
    });
  }

  console.log('\n✅ Processo concluído!');
}

// Executar
processDownloads().catch(console.error);
