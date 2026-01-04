# Guia de Testes - Pé Quente Calçados

## 🎯 Objetivos de Performance e Acessibilidade

### Performance (Lighthouse)
- **Performance Score**: 95+
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Speed Index**: < 3.4s

### Acessibilidade (Lighthouse)
- **Acessibilidade Score**: 100
- **ARIA labels**: Todos os elementos interativos
- **Contraste de cores**: WCAG AA (4.5:1 para texto normal, 3:1 para texto grande)
- **Navegação por teclado**: Funcional em todos os elementos
- **Screen readers**: Compatível

### SEO (Lighthouse)
- **SEO Score**: 100
- **Meta tags**: Completas
- **Structured data**: Implementado (JSON-LD)
- **Sitemap**: Configurado
- **Robots.txt**: Configurado

## 📱 Testes em Dispositivos Reais

### Android
- **Chrome**: Testar em Android 10+ (Samsung, Xiaomi, Motorola)
- **Samsung Internet**: Testar navegação e performance
- **Touch gestures**: Verificar swipe, tap, long press

### iOS
- **Safari**: Testar em iOS 14+ (iPhone 12, 13, 14, 15)
- **Touch targets**: Mínimo 44x44px
- **Zoom**: Prevenir zoom automático em inputs (font-size: 16px)

### Desktop
- **Chrome**: Testar em Windows 10/11 e macOS
- **Firefox**: Verificar compatibilidade
- **Safari**: Testar em macOS
- **Edge**: Verificar renderização

## 🔍 Checklist de Testes

### Funcionalidades Principais
- [ ] Navegação desktop (mega-menu, links)
- [ ] Navegação mobile (menu hambúrguer, drawer)
- [ ] Busca de produtos
- [ ] Filtros de produtos (categoria, marca, preço)
- [ ] Infinite scroll no catálogo
- [ ] Adicionar produto ao carrinho
- [ ] Remover produto do carrinho
- [ ] Atualizar quantidade no carrinho
- [ ] Toast notifications
- [ ] Breadcrumbs funcionando
- [ ] Links do WhatsApp
- [ ] Google Maps embed
- [ ] Newsletter subscription

### Performance
- [ ] Lighthouse Performance 95+
- [ ] Imagens otimizadas (WebP/AVIF)
- [ ] Lazy loading funcionando
- [ ] Blur placeholder nas imagens
- [ ] Code splitting funcionando
- [ ] Fontes otimizadas (next/font)
- [ ] Prefetch de rotas principais

### Acessibilidade
- [ ] Lighthouse Acessibilidade 100
- [ ] Navegação por teclado (Tab, Enter, Esc)
- [ ] Skip-to-content link funcionando
- [ ] Focus indicators visíveis
- [ ] ARIA labels em todos os elementos interativos
- [ ] Contraste de cores adequado
- [ ] Screen reader compatível (NVDA/JAWS/VoiceOver)
- [ ] Prefers-reduced-motion respeitado

### Mobile UX
- [ ] Touch targets mínimos (44x44px)
- [ ] Menu mobile fluido
- [ ] Cards adaptativos
- [ ] Spacing adequado
- [ ] Sem zoom automático em inputs
- [ ] Scroll suave
- [ ] Botão WhatsApp acessível
- [ ] Carrinho drawer funcional em mobile

### Responsividade
- [ ] Breakpoints testados:
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+
- [ ] Grid responsivo funcionando
- [ ] Imagens responsivas (sizes attribute)
- [ ] Texto legível em todas as telas
- [ ] Navegação adaptativa

### Cross-browser
- [ ] Chrome (últimas 2 versões)
- [ ] Firefox (últimas 2 versões)
- [ ] Safari (últimas 2 versões)
- [ ] Edge (últimas 2 versões)

## 🛠️ Ferramentas de Teste

### Performance
```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# Ou usar Chrome DevTools > Lighthouse
```

### Acessibilidade
```bash
# axe DevTools (extensão Chrome)
# WAVE (extensão Chrome)
# Lighthouse Accessibility Audit
```

### Mobile Testing
```bash
# Chrome DevTools > Device Toolbar
# Testar em diferentes dispositivos
# Network throttling (Slow 3G, Fast 3G)
```

## 📊 Métricas Esperadas

### Core Web Vitals
- **LCP**: < 2.5s (Bom)
- **FID**: < 100ms (Bom)
- **CLS**: < 0.1 (Bom)

### Performance Budget
- **JavaScript**: < 200KB (gzipped)
- **CSS**: < 50KB (gzipped)
- **Images**: Otimizadas (WebP/AVIF)
- **Fonts**: Subset, display: swap

## 🐛 Problemas Conhecidos e Soluções

### iOS Safari - Zoom em Inputs
**Solução**: `font-size: 16px` nos inputs (implementado)

### Android Chrome - Touch Delay
**Solução**: `touch-action: manipulation` (implementado via CSS)

### Performance - Imagens Grandes
**Solução**: next/image com otimização automática (implementado)

### Acessibilidade - Focus Indicators
**Solução**: `focus-visible` com outline vermelho (implementado)

## ✅ Checklist Final Antes do Deploy

- [ ] Todos os testes acima passando
- [ ] Lighthouse Performance 95+
- [ ] Lighthouse Acessibilidade 100
- [ ] Lighthouse SEO 100
- [ ] Testado em dispositivos reais (Android + iOS)
- [ ] Testado em navegadores principais
- [ ] Sem erros no console
- [ ] Sem warnings do TypeScript
- [ ] Build de produção sem erros
- [ ] Sitemap gerado
- [ ] Robots.txt configurado
- [ ] Meta tags completas
- [ ] Open Graph tags configuradas
- [ ] Structured data validado

## 🚀 Comandos Úteis

```bash
# Build de produção
npm run build

# Iniciar servidor de produção
npm start

# Type check
npm run type-check

# Lint
npm run lint

# Lighthouse (após build)
lighthouse http://localhost:3000 --view --only-categories=performance,accessibility,seo
```

## 📝 Notas Finais

- Testar sempre em modo de produção (`npm run build && npm start`)
- Usar Network throttling para simular conexões lentas
- Testar em dispositivos reais, não apenas emuladores
- Verificar console do navegador para erros
- Validar structured data em https://search.google.com/test/rich-results
