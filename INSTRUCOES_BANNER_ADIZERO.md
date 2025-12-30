# 🎨 Instruções: Configurar Banner 2 - Adizero

## ✅ Como Exportar e Configurar o Banner do Adizero Studio

### 📁 Passo 1: Exportar o Banner do Adizero Studio

1. **Execute o projeto Adizero Banner Studio:**
   ```bash
   cd "C:\Users\pc\Desktop\Banners\Banner\adizero-banner-studio"
   npm install
   npm run dev
   ```

2. **Gere ou carregue o banner** que você quer usar

3. **Exporte/Salve a imagem do banner:**
   - Tire um screenshot do banner gerado, OU
   - Use a ferramenta de download/export do browser (se disponível), OU
   - Salve a URL da imagem gerada e baixe ela

### 📁 Passo 2: Salvar a Imagem no Projeto

**Local para salvar:**
```
C:\Users\pc\pe-quente-calcados\public\images\banners\adizero-banner.jpg
```

**Ou se for PNG:**
```
C:\Users\pc\pe-quente-calcados\public\images\banners\adizero-banner.png
```

### 📝 Passo 3: Atualizar o Código (se necessário)

O código já está configurado para usar:
- Arquivo: `adizero-banner.jpg` (ou `.png`)

Se você salvar com outro nome, ajuste no arquivo `components/Hero/HeroBanner.tsx`:
- Linha do banner 2: `bannerImage: '/images/banners/NOME_DO_SEU_ARQUIVO.ext'`

### ✅ Passo 4: Verificar

Após salvar a imagem:
1. Recarregue a página do site
2. O banner 2 exibirá automaticamente a imagem do Adizero
3. Navegue entre os banners usando as setas ou indicadores

### 🔍 Verificar se a Imagem Está Correta:

```powershell
cd C:\Users\pc\pe-quente-calcados
Test-Path "public\images\banners\adizero-banner.jpg"
```

Ou:
```powershell
Test-Path "public\images\banners\adizero-banner.png"
```

### 📐 Dimensões Recomendadas:

- **Largura**: 1920px
- **Altura**: 600px
- **Proporção**: 16:5
- **Formato**: JPG ou PNG
- **Tamanho**: Otimizado (200-500 KB)

### 💡 Dica:

Se você já tem a imagem exportada em outro local, basta copiá-la para:
```
C:\Users\pc\pe-quente-calcados\public\images\banners\adizero-banner.jpg
```

O código já está preparado e funcionando!
