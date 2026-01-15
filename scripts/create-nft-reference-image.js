/**
 * Script para criar imagem de referência 512x512 (padrão preto/branco)
 * para NFT descriptor do AR.js
 * 
 * Uso: node scripts/create-nft-reference-image.js
 */

const fs = require('fs');
const path = require('path');

// Tentar usar sharp se disponível, senão criar SVG
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  sharp = null;
}

// Caminho do arquivo de saída
const outputPath = path.join(__dirname, '..', 'public', 'data', 'reference-image.png');
const svgPath = path.join(__dirname, '..', 'public', 'data', 'reference-image.svg');

// Criar diretório se não existir
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Dimensões
const SIZE = 512;
const CHECKER_SIZE = 64; // Tamanho de cada quadrado do checkerboard

// Criar padrão checkerboard (tabuleiro de xadrez) preto/branco
const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="checkerboard" x="0" y="0" width="${CHECKER_SIZE * 2}" height="${CHECKER_SIZE * 2}" patternUnits="userSpaceOnUse">
      <rect width="${CHECKER_SIZE}" height="${CHECKER_SIZE}" fill="#000000"/>
      <rect x="${CHECKER_SIZE}" y="0" width="${CHECKER_SIZE}" height="${CHECKER_SIZE}" fill="#FFFFFF"/>
      <rect x="0" y="${CHECKER_SIZE}" width="${CHECKER_SIZE}" height="${CHECKER_SIZE}" fill="#FFFFFF"/>
      <rect x="${CHECKER_SIZE}" y="${CHECKER_SIZE}" width="${CHECKER_SIZE}" height="${CHECKER_SIZE}" fill="#000000"/>
    </pattern>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#checkerboard)"/>
</svg>`;

// Salvar SVG
fs.writeFileSync(svgPath, svgContent);
console.log(`✓ Imagem SVG criada: ${svgPath}`);

// Tentar criar PNG usando sharp se disponível
if (sharp) {
  (async () => {
    try {
      // Sharp pode converter SVG para PNG
      await sharp(Buffer.from(svgContent))
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Imagem PNG criada: ${outputPath}`);
      console.log(`\n✅ Imagem de referência criada com sucesso!`);
      console.log(`📁 Localização: ${outputPath}`);
      console.log(`📏 Dimensões: ${SIZE}x${SIZE}px`);
      console.log(`🎨 Padrão: Checkerboard preto/branco (${CHECKER_SIZE}x${CHECKER_SIZE}px por quadrado)\n`);
    } catch (error) {
      console.log(`⚠️  Erro ao criar PNG com sharp: ${error.message}`);
      console.log(`\n📝 Use o SVG criado e converta manualmente usando:`);
      console.log(`   - Ferramenta online: https://convertio.co/svg-png/`);
      console.log(`   - Ou use: ${svgPath}\n`);
    }
  })();
} else {
  // Se sharp não estiver disponível, apenas criar SVG
  console.log(`\n⚠️  Sharp não disponível. SVG criado: ${svgPath}`);
  console.log(`\n📝 Para criar PNG, instale sharp: npm install --save-dev sharp`);
  console.log(`   Ou converta manualmente usando:`);
  console.log(`   - Ferramenta online: https://convertio.co/svg-png/`);
  console.log(`   - ImageMagick: magick ${svgPath} ${outputPath}\n`);
}
