const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

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
    
    const requestOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Referer': 'https://www.google.com/'
      }
    };

    const request = protocol.get(url, requestOptions, (response) => {
      // Se for redirecionamento, seguir
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307 || response.statusCode === 308) {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        const redirectUrl = response.headers.location;
        if (!redirectUrl) {
          return reject(new Error('Redirecionamento sem URL'));
        }
        const absoluteUrl = redirectUrl.startsWith('http') ? redirectUrl : new URL(redirectUrl, url).href;
        return downloadFile(absoluteUrl, filepath).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        return reject(new Error(`Erro HTTP: ${response.statusCode}`));
      }

      // Verificar content-type
      const contentType = response.headers['content-type'] || '';
      if (!contentType.startsWith('image/')) {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        return reject(new Error(`Não é uma imagem: ${contentType}`));
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
      reject(new Error('Timeout'));
    });
  });
}

// Função para buscar imagem usando DuckDuckGo (sem API key necessário)
async function searchImageUrl(query) {
  return new Promise((resolve, reject) => {
    // Usar DuckDuckGo Instant Answer API (gratuito, sem chave)
    const searchQuery = encodeURIComponent(query + ' produto fundo branco');
    const url = `https://html.duckduckgo.com/html/?q=${searchQuery}&iax=images&ia=images`;
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        // Extrair primeira URL de imagem do HTML
        const imgMatches = data.match(/https?:\/\/[^"'\s]+\.(jpg|jpeg|png|webp)/gi);
        if (imgMatches && imgMatches.length > 0) {
          // Filtrar URLs válidas e retornar a primeira
          const validUrl = imgMatches.find(url => 
            !url.includes('logo') && 
            !url.includes('icon') &&
            url.includes('http')
          );
          resolve(validUrl || imgMatches[0]);
        } else {
          reject(new Error('Nenhuma imagem encontrada'));
        }
      });
    }).on('error', reject);
  });
}

// Função alternativa: usar Unsplash API (gratuita, sem autenticação para algumas queries)
async function searchUnsplashImage(query) {
  return new Promise((resolve, reject) => {
    const searchQuery = encodeURIComponent(query);
    // Unsplash Source (não oficial, mas funciona)
    const url = `https://source.unsplash.com/800x800/?${searchQuery}`;
    resolve(url); // Retorna URL direta do Unsplash
  });
}

// Função para tentar buscar e baixar imagem real
async function fetchRealImage(product, imagePath) {
  const filename = imagePath.split('/').pop();
  const filepath = path.join(publicImagesPath, filename);

  // Se já existe, pular
  if (fs.existsSync(filepath)) {
    return { success: true, method: 'exists', filename };
  }

  // Criar query de busca
  const searchQuery = `${product.brand} ${product.name}`.replace(/Tênis|Chinelo|Chuteira|Sapato|Mochila|Boné|Bola|Mala/gi, '').trim();

  // Estratégia 1: Tentar Unsplash Source (mais rápido, mas pode não ter produtos específicos)
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const unsplashUrl = await searchUnsplashImage(searchQuery);
    await downloadFile(unsplashUrl, filepath);
    return { success: true, method: 'unsplash', filename };
  } catch (error) {
    // Continuar para próxima estratégia
  }

  // Estratégia 2: Tentar DuckDuckGo (mais lento, mas melhor para produtos específicos)
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const imageUrl = await searchImageUrl(searchQuery);
    if (imageUrl) {
      await downloadFile(imageUrl, filepath);
      return { success: true, method: 'duckduckgo', filename };
    }
  } catch (error) {
    // Continuar
  }

  return { success: false, error: 'Não foi possível encontrar imagem' };
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

  console.log('🚀 Iniciando busca e download de imagens reais...\n');
  console.log('⚠️  AVISO: Este processo pode demorar. Aguarde...\n');

  let downloaded = 0;
  let failed = 0;
  const failedImages = [];

  for (let i = 0; i < missingImages.length; i++) {
    const { product, filename } = missingImages[i];
    
    try {
      const result = await fetchRealImage(product, missingImages[i].imagePath);
      
      if (result.success) {
        console.log(`✓ ${i + 1}/${missingImages.length} - Baixado: ${filename} (${result.method})`);
        downloaded++;
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
    
    // Delay entre requisições para não sobrecarregar
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  // Resumo
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO');
  console.log('='.repeat(60));
  console.log(`✓ Baixadas: ${downloaded}`);
  console.log(`✗ Falhas: ${failed}`);

  if (failedImages.length > 0) {
    console.log('\n❌ Imagens com erro:');
    failedImages.forEach(({ filename, product, error }) => {
      console.log(`  - ${filename} (${product})`);
      console.log(`    Erro: ${error}\n`);
    });
  }

  console.log('\n✅ Processo concluído!');
}

// Executar
processMissingImages().catch(console.error);
