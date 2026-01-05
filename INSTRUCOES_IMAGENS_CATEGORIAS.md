# 🎨 Instruções: Imagens de Categorias Populares

## 📋 Especificações Técnicas

### Formato e Localização
- **Formato**: PNG (com fundo transparente recomendado)
- **Localização**: `/public/images/categorias/`
- **Nomes dos arquivos**:
  - `tenis-masc.png` (Masculino)
  - `tenis-fem.png` (Feminino)
  - `chinelos.png` (Chinelos)
  - `acessorios.png` (Acessórios)
  - `outlet.png` (Outlet)

### Dimensões Recomendadas
- **Tamanho ideal**: 400x400px (quadrado 1:1)
- **Tamanho mínimo**: 300x300px
- **Tamanho máximo**: 600x600px
- **Resolução**: 72-96 DPI
- **Aspect Ratio**: 1:1 (quadrado)

### Características Visuais

1. **Fundo**: Transparente (PNG com alpha) ou branco sólido
2. **Produto**: Centralizado, preferencialmente na parte inferior
3. **Margens**: Deixar espaço ao redor (20-30% de margem)
4. **Perspectiva**: Vista lateral ou 3/4 do produto (não top-down)
5. **Sombra**: Opcional, sutil na parte inferior

### Otimização

**Status Atual**: As imagens estão em ~1MB cada, mas o Next.js otimiza automaticamente:
- ✅ Conversão automática para WebP/AVIF
- ✅ Redimensionamento responsivo
- ✅ Lazy loading (exceto as 2 primeiras)
- ✅ Blur placeholder com gradiente roxo
- ✅ Qualidade otimizada (80%)

**Recomendação**: Para melhor performance, comprimir as imagens originais:
- **Tamanho ideal do arquivo**: 50-150 KB (PNG comprimido)
- **Ferramentas**: TinyPNG, ImageOptim, ou similar
- **Formato**: PNG-24 com compressão otimizada

### Como as Imagens são Renderizadas

- **Container circular**: 220px (desktop), 180px (tablet), 150px (mobile)
- **Imagem ocupa**: 85% do círculo (CSS: `width: 85%`)
- **Posicionamento**: `object-position: center bottom`
- **Escala**: `object-fit: contain` (mantém proporção)
- **Hover**: Escala 1.2x e eleva -20% no eixo Y

### Estrutura Visual

```
┌─────────────────┐
│                 │ ← Margem superior (20-30%)
│                 │
│      [Produto]  │ ← Produto centralizado
│                 │
│    [Sombra]     │ ← Base/sombra na parte inferior
└─────────────────┘
```

### Dicas de Design

- ✅ Use fundo transparente para integração perfeita com gradiente roxo
- ✅ Se usar fundo branco, aplique leve arredondamento nas bordas
- ✅ Evite textos ou badges na imagem (use CSS se necessário)
- ✅ Mantenha o produto focado e nítido
- ✅ Otimize o tamanho do arquivo (50-150 KB ideal)
- ✅ Use PNG-24 para melhor qualidade de transparência

### Exemplo por Categoria

**Masculino (tenis-masc.png)**
- Tênis masculino (preto/cinza/azul)
- Vista lateral ou 3/4
- Fundo transparente ou branco
- Sombra sutil na parte inferior
- Dimensões: 400x400px

**Feminino (tenis-fem.png)**
- Tênis feminino (cores variadas)
- Vista lateral ou 3/4
- Fundo transparente ou branco
- Sombra sutil na parte inferior
- Dimensões: 400x400px

**Chinelos (chinelos.png)**
- Chinelo/sandália
- Vista superior ou lateral
- Fundo transparente ou branco
- Sombra sutil
- Dimensões: 400x400px

**Acessórios (acessorios.png)**
- Coleção de acessórios (mochila, boné, meias)
- Composição centralizada
- Fundo transparente ou branco
- Sombra sutil
- Dimensões: 400x400px

**Outlet (outlet.png)**
- Múltiplos produtos empilhados
- Tag "50% OFF" opcional (ou usar CSS)
- Fundo transparente ou branco
- Sombra sutil
- Dimensões: 400x400px
