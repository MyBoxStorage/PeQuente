# 🧪 PROMPT COMPLETO PARA AGENTE DE TESTES - HEADER PREMIUM

Você é um especialista em testes de qualidade de software para aplicações React/Next.js. Sua tarefa é executar uma bateria completa de testes no componente Header Premium recém-implementado do site Pé Quente Calçados.

---

## 📋 CONTEXTO DO PROJETO

### Informações Técnicas
- **Framework**: Next.js 16 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: Zustand (para carrinho)
- **Componente testado**: `HeaderPremium`
- **URL local**: http://localhost:3000
- **URL produção**: https://pe-quente-ihmg.vercel.app/

### Estrutura de Diretórios Relevante

```
pe-quente-calcados/
├── app/
│   ├── layout.tsx                    # Layout raiz que importa HeaderPremium
│   ├── page.tsx                      # Página home
│   ├── produtos/
│   │   └── page.tsx                  # Página de produtos
│   └── contato/
│       └── page.tsx                  # Página de contato
│
├── components/
│   ├── Header/
│   │   ├── HeaderPremium.tsx         # ⭐ COMPONENTE PRINCIPAL A TESTAR
│   │   └── SearchBar.tsx             # Componente de busca usado pelo header
│   │
│   └── cart/
│       └── CartModal.tsx             # Modal do carrinho usado pelo header
│
├── store/
│   └── cartStore.ts                  # Store Zustand para gerenciar carrinho
│
├── lib/
│   ├── api.ts                        # Funções de API (getAllCategories, searchProducts)
│   └── utils.ts                      # Utilitários (formatPrice)
│
├── data/
│   ├── categories.json               # Dados de categorias
│   ├── products.json                 # Dados de produtos
│   └── brands.json                   # Dados de marcas
│
├── types/
│   └── index.ts                      # Definições de tipos TypeScript
│
└── public/
    └── logo-pe-quente.svg            # Logo usado no header
```

### Arquivos Relacionados ao Header Premium

#### 1. Componente Principal
- **Arquivo**: `components/Header/HeaderPremium.tsx`
- **Linhas**: 1-339
- **Dependências**:
  - `SearchBar` (linha 10)
  - `CartModal` (linha 9)
  - `useCartStore` (linha 8)
  - `getAllCategories` (linha 7)

#### 2. Componentes Dependentes
- **SearchBar.tsx**: `components/Header/SearchBar.tsx` (linhas 1-142)
- **CartModal.tsx**: `components/cart/CartModal.tsx` (linhas 1-183)

#### 3. Store e Utilitários
- **cartStore.ts**: `store/cartStore.ts` (linhas 1-113)
- **api.ts**: `lib/api.ts` (linhas 1-80)
- **utils.ts**: `lib/utils.ts` (contém formatPrice)

#### 4. Layout Principal
- **layout.tsx**: `app/layout.tsx` (linhas 1-109)
  - Importa HeaderPremium na linha 5
  - Renderiza na linha 99

---

## 🔧 PREPARAÇÃO INICIAL

### Passo 1: Verificar Ambiente

Execute os seguintes comandos na pasta raiz do projeto (`C:\Users\pc\pe-quente-calcados`):

```bash
# Navegar para o diretório do projeto
cd C:\Users\pc\pe-quente-calcados

# Verificar TypeScript (sem erros)
npm run type-check

# Verificar Linter (sem erros críticos)
npm run lint

# Build de produção (opcional, para testes completos)
npm run build
```

**Resultado esperado**: Todos os comandos devem executar sem erros críticos.

### Passo 2: Iniciar Servidor

```bash
# Para desenvolvimento (modo rápido)
npm run dev

# OU para produção (testes mais precisos)
npm run build
npm start
```

**Resultado esperado**: Servidor deve iniciar em http://localhost:3000

### Passo 3: Verificar Servidor

1. Abrir navegador em: http://localhost:3000
2. Verificar que o site carrega corretamente
3. Abrir Chrome DevTools (F12) para inspecionar elementos
4. Verificar que o Header Premium está visível no topo da página

### Passo 4: Preparar Documentação

Crie um documento (pode ser texto, markdown, ou lista) para anotar resultados. Para cada teste, anote:
- ✅ **PASSOU** (se funcionou corretamente)
- ❌ **FALHOU** (se não funcionou)
- ⚠️ **PARCIAL** (se funcionou parcialmente)
- 📝 **Comentários adicionais** (se necessário)

---

## 📝 INSTRUÇÕES DE TESTES

Execute TODOS os testes abaixo em ordem, documentando cada resultado.

---

## CATEGORIA 1: TESTES FUNCIONAIS BÁSICOS (15 minutos)

### 1.1 Logo e Home

#### Teste 1.1.1: Logo clicável
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 108-119)
- **Ação**: Clicar no logo no header
- **Resultado esperado**: Deve redirecionar para a página home "/"
- **Como verificar**: URL deve mudar para "http://localhost:3000/"
- **Código verificado**: 
  ```typescript
  <Link href="/" className="flex items-center group" aria-label="Logo Pé Quente Calçados" prefetch>
    <img src="/logo-pe-quente.svg" alt="Pé Quente Calçados" className="h-10 md:h-12 w-auto object-contain" />
  </Link>
  ```
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.1.2: Logo visível e carregado
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linha 115)
- **Ação**: Verificar se o logo aparece no header
- **Resultado esperado**: Logo deve estar visível e carregado corretamente
- **Como verificar**: Inspecionar elemento `<img>` no DevTools, verificar que `src="/logo-pe-quente.svg"` está correto
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 1.2 Navegação Desktop

#### Teste 1.2.1: Link Home
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 127-135)
- **Ação**: Clicar no link "Home" no menu desktop
- **Resultado esperado**: Deve redirecionar para "/" e o link deve ficar vermelho (`text-[#FF0000]`)
- **Como verificar**: 
  - URL muda para "http://localhost:3000/"
  - Link "Home" fica vermelho quando estiver na home
- **Código verificado**: Função `isActive` (linhas 76-81)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.2.2: Dropdown Produtos (Hover)
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 138-181)
- **Ação**: Passar o mouse sobre "Produtos" no menu desktop
- **Resultado esperado**: 
  - Dropdown deve abrir mostrando: "Tênis Masculino", "Tênis Feminino", "Acessórios", "Ver Todos"
  - Animação suave (fade-in, slide-in)
  - ChevronDown deve rotacionar 180 graus
- **Como verificar**: 
  - Dropdown aparece abaixo de "Produtos"
  - Verificar classes CSS: `animate-in fade-in-0 slide-in-from-top-2`
  - Verificar rotação do ícone: `rotate-180`
- **Código verificado**: 
  - `handleProductsMouseEnter` (linhas 62-68)
  - `handleProductsMouseLeave` (linhas 70-74)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.2.3: Dropdown Produtos (Clicar em categoria)
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 162-171)
- **Ação**: Clicar em "Tênis Masculino" no dropdown
- **Resultado esperado**: 
  - Deve redirecionar para `/produtos?categoria=tenis-masculino`
  - Dropdown deve fechar
- **Como verificar**: 
  - URL muda para "http://localhost:3000/produtos?categoria=tenis-masculino"
  - Dropdown desaparece
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.2.4: Dropdown Produtos (Clicar em "Ver Todos")
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 172-178)
- **Ação**: Clicar em "Ver Todos" no dropdown
- **Resultado esperado**: 
  - Deve redirecionar para `/produtos`
  - Dropdown deve fechar
- **Como verificar**: URL muda para "http://localhost:3000/produtos"
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.2.5: Dropdown Produtos (Fechar ao clicar fora)
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 36-51)
- **Ação**: 
  1. Abrir dropdown (hover em "Produtos")
  2. Clicar em qualquer lugar fora do dropdown
- **Resultado esperado**: Dropdown deve fechar
- **Como verificar**: Dropdown desaparece
- **Código verificado**: `useEffect` com `handleClickOutside` (linhas 37-51)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.2.6: Link Marcas
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 183-191)
- **Ação**: Clicar no link "Marcas"
- **Resultado esperado**: Deve redirecionar para "/produtos"
- **Como verificar**: URL muda para "http://localhost:3000/produtos"
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.2.7: Link Promoções
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 193-201)
- **Ação**: Clicar no link "Promoções"
- **Resultado esperado**: Deve redirecionar para "/produtos?promocoes=true"
- **Como verificar**: URL muda para "http://localhost:3000/produtos?promocoes=true"
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.2.8: Link Contato
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 203-211)
- **Ação**: Clicar no link "Contato"
- **Resultado esperado**: Deve redirecionar para "/contato"
- **Como verificar**: URL muda para "http://localhost:3000/contato"
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.2.9: Estado ativo dos links (Home)
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 129-130)
- **Ação**: Estar na página home ("/")
- **Resultado esperado**: Link "Home" deve estar vermelho (`text-[#FF0000]`)
- **Como verificar**: Inspecionar elemento, verificar classe `text-[#FF0000]` aplicada
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.2.10: Estado ativo dos links (Produtos)
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 145-147)
- **Ação**: Estar na página "/produtos"
- **Resultado esperado**: Link "Produtos" deve estar vermelho (`text-[#FF0000]`)
- **Como verificar**: Inspecionar elemento, verificar classe `text-[#FF0000]` aplicada
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 1.3 Busca

#### Teste 1.3.1: Input de busca desktop (Foco)
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 217-233)
- **Ação**: Clicar no input de busca no desktop (lg:flex)
- **Resultado esperado**: 
  - SearchBar modal deve abrir
  - Input deve receber foco
- **Como verificar**: 
  - Componente `SearchBar` aparece (linha 330)
  - Input dentro do SearchBar está focado
- **Código verificado**: `onFocus={() => setSearchOpen(true)}` (linha 223)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.3.2: Botão de busca mobile/tablet
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 235-242)
- **Ação**: Clicar no ícone de busca em mobile/tablet (lg:hidden)
- **Resultado esperado**: SearchBar modal deve abrir
- **Como verificar**: Componente `SearchBar` aparece
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.3.3: SearchBar funcionalidade básica
- **Arquivo relacionado**: `components/Header/SearchBar.tsx` (linhas 1-142)
- **Ação**: 
  1. Abrir SearchBar
  2. Digitar "nike" no input
- **Resultado esperado**: 
  - Deve mostrar resultados de produtos que contenham "nike" no nome, descrição ou marca
  - Máximo de 5 resultados
- **Como verificar**: 
  - Resultados aparecem abaixo do input
  - Cada resultado mostra: imagem, nome, preço
- **Código verificado**: `searchProducts` em `lib/api.ts` (linhas 51-60)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.3.4: SearchBar - Clicar em resultado
- **Arquivo relacionado**: `components/Header/SearchBar.tsx` (linhas 82-128)
- **Ação**: Clicar em um resultado da busca
- **Resultado esperado**: 
  - Deve redirecionar para `/produtos/[slug]`
  - SearchBar deve fechar
- **Como verificar**: 
  - URL muda para página do produto
  - SearchBar desaparece
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.3.5: SearchBar - Fechar ao clicar fora
- **Arquivo relacionado**: `components/Header/SearchBar.tsx` (linhas 25-34)
- **Ação**: 
  1. Abrir SearchBar
  2. Clicar fora do componente
- **Resultado esperado**: SearchBar deve fechar
- **Como verificar**: SearchBar desaparece
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 1.4 WhatsApp

#### Teste 1.4.1: Link WhatsApp
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 244-261)
- **Ação**: Clicar no ícone do WhatsApp
- **Resultado esperado**: 
  - Deve abrir WhatsApp Web/App em nova aba
  - URL deve ser: `https://wa.me/2422632334`
- **Como verificar**: 
  - Nova aba abre com WhatsApp
  - Verificar `target="_blank"` e `rel="noopener noreferrer"`
- **Código verificado**: 
  - `whatsappNumber = '2422632334'` (linha 24)
  - `whatsappUrl = 'https://wa.me/${whatsappNumber}'` (linha 25)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.4.2: Ícone WhatsApp visível
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 252-260)
- **Ação**: Verificar se o ícone do WhatsApp está visível
- **Resultado esperado**: Ícone SVG verde deve estar visível
- **Como verificar**: Inspecionar elemento, verificar que SVG está renderizado
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 1.5 Carrinho

#### Teste 1.5.1: Botão do carrinho
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 263-275)
- **Ação**: Clicar no ícone do carrinho
- **Resultado esperado**: CartModal deve abrir
- **Como verificar**: Modal do carrinho aparece na tela
- **Código verificado**: `onClick={() => setCartOpen(true)}` (linha 265)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.5.2: Badge do carrinho (com itens)
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 270-274)
- **Ação**: 
  1. Adicionar um produto ao carrinho (ir para página de produto e adicionar)
  2. Voltar para home
  3. Verificar badge no header
- **Resultado esperado**: 
  - Badge vermelho deve aparecer no canto superior direito do ícone
  - Deve mostrar o número de itens (ex: "1", "2", "99+")
- **Como verificar**: 
  - Badge visível com número correto
  - Verificar `mounted && itemCount > 0` (linha 270)
- **Código verificado**: 
  - `useCartStore` (linha 19)
  - `getItemCount()` em `store/cartStore.ts` (linhas 103-106)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.5.3: Badge do carrinho (sem itens)
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linha 270)
- **Ação**: Verificar badge quando carrinho está vazio
- **Resultado esperado**: Badge não deve aparecer
- **Como verificar**: Nenhum badge visível no ícone do carrinho
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.5.4: Badge do carrinho (99+ itens)
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linha 272)
- **Ação**: Adicionar mais de 99 itens ao carrinho
- **Resultado esperado**: Badge deve mostrar "99+"
- **Como verificar**: Badge mostra "99+" em vez do número exato
- **Código verificado**: `{itemCount > 99 ? '99+' : itemCount}` (linha 272)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.5.5: CartModal - Abrir e fechar
- **Arquivo relacionado**: `components/cart/CartModal.tsx` (linhas 1-183)
- **Ação**: 
  1. Clicar no ícone do carrinho para abrir
  2. Clicar no X ou fora do modal para fechar
- **Resultado esperado**: 
  - Modal abre com animação slide-in da direita
  - Modal fecha ao clicar no X ou no overlay
- **Como verificar**: 
  - Modal aparece e desaparece suavemente
  - `body.style.overflow` deve ser 'hidden' quando aberto (linhas 40-48)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 1.6 Menu Mobile

#### Teste 1.6.1: Botão hamburger mobile
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 97-105)
- **Ação**: Clicar no botão hamburger em mobile (< md)
- **Resultado esperado**: 
  - Menu mobile deve abrir
  - Ícone muda de Menu para X
- **Como verificar**: 
  - Menu aparece abaixo do header
  - Ícone alterna entre Menu e X
- **Código verificado**: `{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}` (linha 104)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.6.2: Menu mobile - Links funcionais
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 280-325)
- **Ação**: Clicar em cada link do menu mobile
- **Resultado esperado**: 
  - Cada link deve redirecionar corretamente
  - Menu deve fechar após clicar
- **Como verificar**: 
  - Home → "/"
  - Produtos → "/produtos"
  - Marcas → "/produtos"
  - Promoções → "/produtos?promocoes=true"
  - Contato → "/contato"
- **Código verificado**: `onClick={() => setMobileMenuOpen(false)}` em cada link
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 1.6.3: Menu mobile - Estado ativo
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 286-288, 295-297, 318-320)
- **Ação**: Estar em diferentes páginas e verificar menu mobile
- **Resultado esperado**: Links ativos devem estar vermelhos e em negrito
- **Como verificar**: 
  - Na home: "Home" deve estar `text-[#FF0000] font-semibold`
  - Em produtos: "Produtos" deve estar `text-[#FF0000] font-semibold`
  - Em contato: "Contato" deve estar `text-[#FF0000] font-semibold`
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 1.7 Banner Promocional

#### Teste 1.7.1: Banner visível
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 89-92)
- **Ação**: Verificar se o banner promocional está visível
- **Resultado esperado**: Banner azul escuro (`bg-[#00008B]`) com texto branco no topo
- **Como verificar**: Banner aparece acima do header principal
- **Código verificado**: Texto "5% OFF NO PIX | PARCELAMENTO EM 12X | RETIRE NA LOJA EM PARAÍBA DO SUL"
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

## CATEGORIA 2: TESTES DE RESPONSIVIDADE (20 minutos)

### 2.1 Breakpoints Desktop

#### Teste 2.1.1: Desktop (1024px+)
- **Ação**: Abrir DevTools, definir viewport para 1920x1080
- **Resultado esperado**: 
  - Menu desktop completo visível
  - Barra de busca desktop visível (lg:flex)
  - Menu hamburger oculto (md:hidden)
  - Logo maior (md:h-12)
- **Como verificar**: 
  - Navegação desktop aparece (linha 122: `hidden md:flex`)
  - Input de busca aparece (linha 217: `hidden lg:flex`)
  - Menu hamburger oculto (linha 97: `md:hidden`)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 2.1.2: Desktop médio (1024px - 1279px)
- **Ação**: Definir viewport para 1280x720
- **Resultado esperado**: 
  - Menu desktop visível
  - Barra de busca pode estar oculta (lg:flex = 1024px+)
  - Ícone de busca mobile visível (lg:hidden)
- **Como verificar**: Verificar visibilidade dos elementos
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 2.2 Breakpoints Tablet

#### Teste 2.2.1: Tablet (768px - 1023px)
- **Ação**: Definir viewport para 768x1024
- **Resultado esperado**: 
  - Menu desktop visível (md:flex = 768px+)
  - Menu hamburger oculto
  - Barra de busca oculta, ícone de busca visível
- **Como verificar**: 
  - Navegação desktop aparece
  - Input de busca oculto (linha 217: `hidden lg:flex`)
  - Ícone de busca aparece (linha 236: `lg:hidden`)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 2.3 Breakpoints Mobile

#### Teste 2.3.1: Mobile grande (640px - 767px)
- **Ação**: Definir viewport para 640x960
- **Resultado esperado**: 
  - Menu hamburger visível
  - Menu desktop oculto
  - Logo menor (h-10)
  - Ícone de busca visível
- **Como verificar**: 
  - Menu hamburger aparece (linha 97: `md:hidden`)
  - Navegação desktop oculta (linha 122: `hidden md:flex`)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 2.3.2: Mobile pequeno (320px - 639px)
- **Ação**: Definir viewport para 375x667 (iPhone SE)
- **Resultado esperado**: 
  - Todos os elementos devem estar visíveis e acessíveis
  - Touch targets mínimos de 44x44px
  - Sem overflow horizontal
- **Como verificar**: 
  - Inspecionar botões, verificar `minWidth: '44px', minHeight: '44px'` (linha 102)
  - Verificar que não há scroll horizontal
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 2.3.3: Mobile muito pequeno (320px)
- **Ação**: Definir viewport para 320x568
- **Resultado esperado**: 
  - Layout não quebra
  - Elementos não se sobrepõem
  - Texto legível
- **Como verificar**: Verificar layout completo
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 2.4 Espaçamento do Header Fixo

#### Teste 2.4.1: Espaçamento correto
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linha 336)
- **Ação**: Verificar se há espaço suficiente abaixo do header fixo
- **Resultado esperado**: 
  - Deve haver um `<div>` com altura `h-[73px] md:h-[81px]` para compensar o header fixo
  - Conteúdo não deve ficar escondido atrás do header
- **Como verificar**: 
  - Inspecionar elemento após o header
  - Verificar que o conteúdo começa após o espaçamento
- **Código verificado**: `<div className="h-[73px] md:h-[81px]" aria-hidden="true" />` (linha 336)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

## CATEGORIA 3: TESTES DE ACESSIBILIDADE (15 minutos)

### 3.1 ARIA Labels

#### Teste 3.1.1: ARIA labels presentes
- **Ação**: Inspecionar elementos interativos no DevTools
- **Resultado esperado**: Todos os botões e links devem ter `aria-label` apropriado
- **Elementos a verificar**:
  - Botão hamburger: `aria-label="Menu"` (linha 100)
  - Logo: `aria-label="Logo Pé Quente Calçados"` (linha 111)
  - Navegação desktop: `aria-label="Menu principal"` (linha 125)
  - Botão Produtos: `aria-expanded` e `aria-haspopup="true"` (linhas 148-149)
  - Input busca: verificar se tem label (pode ser implícito)
  - Botão busca: `aria-label="Buscar"` (linha 227)
  - WhatsApp: `aria-label="Falar no WhatsApp"` (linha 250)
  - Carrinho: `aria-label="Carrinho"` (linha 267)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 3.1.2: Role attributes
- **Ação**: Inspecionar elementos semânticos
- **Resultado esperado**: 
  - `<header>` deve ter `role="banner"` (linha 87)
  - `<nav>` deve ter `role="navigation"` (linhas 124, 282)
- **Como verificar**: Inspecionar elementos no DevTools
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 3.2 Navegação por Teclado

#### Teste 3.2.1: Tab navigation
- **Ação**: Pressionar Tab repetidamente na página
- **Resultado esperado**: 
  - Foco deve percorrer todos os elementos interativos na ordem lógica
  - Focus indicators devem ser visíveis
- **Como verificar**: 
  - Verificar classes `focus:outline-none focus:ring-2 focus:ring-[#FF0000]` (exemplo linha 129)
  - Foco deve ser visível em todos os elementos
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 3.2.2: Enter/Space em botões
- **Ação**: 
  1. Navegar até um botão com Tab
  2. Pressionar Enter ou Space
- **Resultado esperado**: Botão deve executar sua ação
- **Elementos a testar**:
  - Botão hamburger
  - Botão busca
  - Botão carrinho
  - Botão "Produtos" (dropdown)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 3.2.3: Esc para fechar modais
- **Ação**: 
  1. Abrir SearchBar ou CartModal
  2. Pressionar Esc
- **Resultado esperado**: Modal deve fechar
- **Nota**: Verificar se `SearchBar` e `CartModal` implementam Esc
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 3.2.4: Dropdown com teclado
- **Ação**: 
  1. Navegar até "Produtos" com Tab
  2. Pressionar Enter ou Space para abrir dropdown
  3. Navegar pelos itens do dropdown com setas
- **Resultado esperado**: 
  - Dropdown abre
  - Navegação por setas funciona
- **Nota**: Pode não estar implementado, verificar comportamento atual
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 3.3 Contraste de Cores

#### Teste 3.3.1: Contraste texto/bg
- **Ação**: Usar ferramenta de contraste (DevTools > Lighthouse ou extensão)
- **Resultado esperado**: 
  - Texto branco sobre fundo azul escuro (#00008B): deve ter contraste adequado
  - Texto cinza sobre fundo branco: deve ter contraste adequado (WCAG AA: 4.5:1)
- **Elementos a verificar**:
  - Banner promocional (linha 90: `bg-[#00008B] text-white`)
  - Links do menu (linha 129: `text-gray-800`)
  - Texto do logo
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 3.4 Screen Readers

#### Teste 3.4.1: Teste com NVDA/JAWS/VoiceOver
- **Ação**: Ativar screen reader e navegar pelo header
- **Resultado esperado**: 
  - Todos os elementos devem ser anunciados corretamente
  - ARIA labels devem ser lidos
  - Estado dos elementos (aberto/fechado) deve ser anunciado
- **Como verificar**: 
  - Usar NVDA (Windows), JAWS (Windows), ou VoiceOver (Mac/iOS)
  - Navegar pelo header e verificar anúncios
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

## CATEGORIA 4: TESTES DE PERFORMANCE (10 minutos)

### 4.1 Lighthouse Performance

#### Teste 4.1.1: Lighthouse Score
- **Ação**: 
  1. Abrir Chrome DevTools > Lighthouse
  2. Executar auditoria de Performance
  3. Verificar score
- **Resultado esperado**: Performance score ≥ 95
- **Como verificar**: Verificar métricas no relatório
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 4.1.2: Core Web Vitals
- **Ação**: Verificar métricas no Lighthouse
- **Resultado esperado**: 
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1
- **Como verificar**: Verificar métricas no relatório Lighthouse
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 4.2 Hydration

#### Teste 4.2.1: Sem erros de hydration
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 17, 32-34, 270)
- **Ação**: 
  1. Abrir DevTools > Console
  2. Recarregar a página
- **Resultado esperado**: Não deve haver erros de hydration
- **Como verificar**: 
  - Verificar que `mounted` state previne hydration mismatch (linha 270)
  - Console não deve mostrar erros de hydration
- **Código verificado**: 
  - `useState(false)` para `mounted` (linha 17)
  - `useEffect(() => setMounted(true))` (linhas 32-34)
  - Renderização condicional: `{mounted && itemCount > 0 && ...}` (linha 270)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 4.3 Re-renders

#### Teste 4.3.1: React DevTools Profiler
- **Ação**: 
  1. Abrir React DevTools > Profiler
  2. Iniciar gravação
  3. Interagir com o header (abrir menu, dropdown, etc.)
  4. Parar gravação
- **Resultado esperado**: 
  - Apenas componentes necessários devem re-renderizar
  - Não deve haver re-renders desnecessários
- **Como verificar**: Verificar no Profiler quais componentes renderizaram
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

## CATEGORIA 5: TESTES DE INTEGRAÇÃO (10 minutos)

### 5.1 Integração com Carrinho

#### Teste 5.1.1: Badge atualiza ao adicionar item
- **Arquivo relacionado**: 
  - `components/Header/HeaderPremium.tsx` (linha 19)
  - `store/cartStore.ts` (linhas 103-106)
- **Ação**: 
  1. Ir para página de produto
  2. Adicionar produto ao carrinho
  3. Verificar badge no header
- **Resultado esperado**: Badge deve aparecer/atualizar imediatamente
- **Como verificar**: Badge mostra número correto de itens
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 5.1.2: Badge atualiza ao remover item
- **Ação**: 
  1. Ter itens no carrinho
  2. Abrir CartModal e remover um item
  3. Verificar badge no header
- **Resultado esperado**: Badge deve atualizar ou desaparecer
- **Como verificar**: Badge reflete o estado atual do carrinho
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 5.2 Integração com Navegação

#### Teste 5.2.1: Header persiste entre páginas
- **Ação**: Navegar entre diferentes páginas (Home, Produtos, Contato)
- **Resultado esperado**: Header deve permanecer fixo e visível
- **Como verificar**: Header não desaparece ou recarrega
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 5.2.2: Estado ativo atualiza ao navegar
- **Ação**: Navegar entre páginas
- **Resultado esperado**: Links ativos devem atualizar corretamente
- **Como verificar**: 
  - Na home: "Home" vermelho
  - Em produtos: "Produtos" vermelho
  - Em contato: "Contato" vermelho
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 5.3 Integração com SearchBar

#### Teste 5.3.1: SearchBar abre e fecha corretamente
- **Arquivo relacionado**: 
  - `components/Header/HeaderPremium.tsx` (linhas 15, 223, 237, 330)
  - `components/Header/SearchBar.tsx` (linha 12)
- **Ação**: 
  1. Abrir SearchBar (foco no input ou clicar no ícone)
  2. Fechar SearchBar (clicar fora ou fechar)
- **Resultado esperado**: 
  - SearchBar abre quando `searchOpen === true`
  - SearchBar fecha quando `searchOpen === false`
- **Como verificar**: 
  - Verificar estado `searchOpen` (linha 15)
  - Verificar renderização condicional (linha 330)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 5.4 Integração com CartModal

#### Teste 5.4.1: CartModal abre e fecha corretamente
- **Arquivo relacionado**: 
  - `components/Header/HeaderPremium.tsx` (linhas 16, 265, 333)
  - `components/cart/CartModal.tsx` (linhas 12-14)
- **Ação**: 
  1. Clicar no ícone do carrinho
  2. Fechar o modal
- **Resultado esperado**: 
  - CartModal abre quando `cartOpen === true`
  - CartModal fecha quando `cartOpen === false`
- **Como verificar**: 
  - Verificar estado `cartOpen` (linha 16)
  - Verificar renderização: `<CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />` (linha 333)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

## CATEGORIA 6: TESTES VISUAIS (10 minutos)

### 6.1 Estilos e Cores

#### Teste 6.1.1: Cores do tema
- **Ação**: Verificar cores aplicadas
- **Resultado esperado**: 
  - Background branco: `bg-white` (linha 86)
  - Texto vermelho para links ativos: `text-[#FF0000]` (linha 130)
  - Banner azul: `bg-[#00008B]` (linha 90)
  - Sombra: `shadow-md` (linha 86)
- **Como verificar**: Inspecionar elementos no DevTools
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 6.1.2: Hover effects
- **Ação**: Passar mouse sobre elementos interativos
- **Resultado esperado**: 
  - Links devem mudar para vermelho no hover: `hover:text-[#FF0000]` (linha 129)
  - Botões devem ter hover suave: `hover:bg-gray-100` (linha 99)
  - Transições suaves: `transition-all duration-300` (linha 129)
- **Como verificar**: Verificar mudanças visuais no hover
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 6.2 Animações

#### Teste 6.2.1: Dropdown animation
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linha 161)
- **Ação**: Abrir dropdown de Produtos
- **Resultado esperado**: 
  - Dropdown deve aparecer com animação: `animate-in fade-in-0 slide-in-from-top-2 duration-300`
  - ChevronDown deve rotacionar: `rotate-180` (linha 154)
- **Como verificar**: Verificar animação suave
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 6.2.2: CartModal animation
- **Arquivo relacionado**: `components/cart/CartModal.tsx` (linha 64)
- **Ação**: Abrir CartModal
- **Resultado esperado**: Modal deve deslizar da direita: `animate-in slide-in-from-right`
- **Como verificar**: Verificar animação de entrada
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 6.3 Layout e Espaçamento

#### Teste 6.3.1: Container e padding
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linha 95)
- **Ação**: Verificar layout do header
- **Resultado esperado**: 
  - Container centralizado: `container mx-auto`
  - Padding responsivo: `px-4 md:px-6`
  - Max width: `max-w-7xl`
  - Espaçamento vertical: `py-4`
- **Como verificar**: Inspecionar elemento no DevTools
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 6.3.2: Alinhamento de elementos
- **Ação**: Verificar alinhamento visual
- **Resultado esperado**: 
  - Logo, navegação e ações devem estar alinhados verticalmente
  - Espaçamento consistente entre elementos
- **Como verificar**: Verificar visualmente e no DevTools
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

## CATEGORIA 7: TESTES DE EDGE CASES (10 minutos)

### 7.1 Estados Extremos

#### Teste 7.1.1: Carrinho com muitos itens (100+)
- **Ação**: Adicionar mais de 100 itens ao carrinho
- **Resultado esperado**: 
  - Badge deve mostrar "99+"
  - Performance não deve degradar
- **Como verificar**: Verificar badge e performance
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 7.1.2: Busca com muitos resultados
- **Ação**: Buscar por termo genérico (ex: "tênis")
- **Resultado esperado**: 
  - Deve mostrar máximo de 5 resultados (linha 40 em SearchBar.tsx)
  - Performance não deve degradar
- **Como verificar**: Verificar que apenas 5 resultados aparecem
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 7.1.3: Busca sem resultados
- **Ação**: Buscar por termo que não existe (ex: "xyzabc123")
- **Resultado esperado**: 
  - Deve mostrar mensagem "Nenhum produto encontrado" (linha 136 em SearchBar.tsx)
- **Como verificar**: Verificar mensagem aparece
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 7.2 Comportamento de Timeout

#### Teste 7.2.1: Dropdown timeout
- **Arquivo relacionado**: `components/Header/HeaderPremium.tsx` (linhas 70-74)
- **Ação**: 
  1. Abrir dropdown (hover)
  2. Remover mouse rapidamente
- **Resultado esperado**: 
  - Dropdown deve fechar após 300ms (timeout)
- **Como verificar**: Verificar que dropdown fecha após delay
- **Código verificado**: `setTimeout(() => setProductsDropdownOpen(false), 300)` (linha 71)
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 7.3 Múltiplas Interações

#### Teste 7.3.1: Abrir múltiplos modais
- **Ação**: 
  1. Abrir SearchBar
  2. Tentar abrir CartModal ao mesmo tempo
- **Resultado esperado**: 
  - Apenas um modal deve estar aberto por vez
  - Comportamento deve ser previsível
- **Como verificar**: Verificar que apenas um modal está visível
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

## CATEGORIA 8: TESTES DE CROSS-BROWSER (15 minutos)

### 8.1 Chrome

#### Teste 8.1.1: Chrome Desktop
- **Ação**: Testar no Chrome (última versão)
- **Resultado esperado**: Todas as funcionalidades devem funcionar
- **Como verificar**: Executar testes funcionais básicos
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 8.2 Firefox

#### Teste 8.2.1: Firefox Desktop
- **Ação**: Testar no Firefox (última versão)
- **Resultado esperado**: Todas as funcionalidades devem funcionar
- **Como verificar**: Executar testes funcionais básicos
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 8.3 Safari

#### Teste 8.3.1: Safari Desktop (Mac)
- **Ação**: Testar no Safari (última versão)
- **Resultado esperado**: Todas as funcionalidades devem funcionar
- **Como verificar**: Executar testes funcionais básicos
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 8.4 Edge

#### Teste 8.4.1: Edge Desktop
- **Ação**: Testar no Edge (última versão)
- **Resultado esperado**: Todas as funcionalidades devem funcionar
- **Como verificar**: Executar testes funcionais básicos
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

### 8.5 Mobile Browsers

#### Teste 8.5.1: Chrome Mobile (Android)
- **Ação**: Testar no Chrome Mobile
- **Resultado esperado**: Menu mobile deve funcionar, touch targets adequados
- **Como verificar**: Executar testes de responsividade mobile
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

#### Teste 8.5.2: Safari Mobile (iOS)
- **Ação**: Testar no Safari Mobile
- **Resultado esperado**: Menu mobile deve funcionar, touch targets adequados
- **Como verificar**: Executar testes de responsividade mobile
- **Resultado**: [ ] ✅ PASSOU / [ ] ❌ FALHOU / [ ] ⚠️ PARCIAL

---

## 📊 RESUMO E RELATÓRIO FINAL

### Contagem de Resultados

Preencha o resumo abaixo:

- **Total de testes**: _____
- **✅ PASSOU**: _____
- **❌ FALHOU**: _____
- **⚠️ PARCIAL**: _____

### Problemas Críticos Encontrados

Liste os problemas críticos (que impedem o uso do componente):

1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Problemas Menores Encontrados

Liste os problemas menores (melhorias sugeridas):

1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Recomendações

Liste recomendações para melhorias:

1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

---

## ✅ CHECKLIST FINAL

Marque cada item após verificação:

### Funcionalidade
- [ ] Todos os links funcionam corretamente
- [ ] Dropdown de produtos funciona
- [ ] Busca funciona
- [ ] Carrinho funciona
- [ ] WhatsApp abre corretamente
- [ ] Menu mobile funciona

### Responsividade
- [ ] Desktop (1024px+)
- [ ] Tablet (768px - 1023px)
- [ ] Mobile (320px - 767px)
- [ ] Espaçamento do header fixo correto

### Acessibilidade
- [ ] ARIA labels presentes
- [ ] Navegação por teclado funciona
- [ ] Contraste de cores adequado
- [ ] Screen readers compatíveis

### Performance
- [ ] Lighthouse Performance ≥ 95
- [ ] Sem erros de hydration
- [ ] Re-renders otimizados

### Integração
- [ ] Integração com carrinho funciona
- [ ] Integração com navegação funciona
- [ ] Integração com SearchBar funciona
- [ ] Integração com CartModal funciona

### Visual
- [ ] Cores e estilos corretos
- [ ] Animações suaves
- [ ] Layout consistente

### Cross-browser
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Chrome Mobile
- [ ] Safari Mobile

---

## 📝 NOTAS ADICIONAIS

Use este espaço para anotações adicionais durante os testes:

_________________________________________________
_________________________________________________
_________________________________________________

---

## 🎯 CONCLUSÃO

Após completar todos os testes, forneça uma conclusão geral sobre o estado do componente Header Premium:

**Status Geral**: [ ] ✅ APROVADO / [ ] ⚠️ APROVADO COM RESSALVAS / [ ] ❌ REPROVADO

**Comentários Finais**:

_________________________________________________
_________________________________________________
_________________________________________________

---

**Data do Teste**: _____ / _____ / _____

**Testador**: _________________________

**Versão do Componente**: HeaderPremium v1.0

**Ambiente de Teste**: 
- Next.js: 16.1.1
- React: 19.2.3
- TypeScript: 5.x
- Node.js: _____

---

**FIM DO PROMPT DE TESTES**
