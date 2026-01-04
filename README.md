# Pé Quente Calçados - E-commerce Vitrine

Site vitrine para a loja Pé Quente Calçados, localizada em Paraíba do Sul, RJ. Desenvolvido com Next.js 14+, React, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 16.1** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Zustand** - Gerenciamento de estado (carrinho)
- **React Hook Form + Zod** - Validação de formulários
- **Lucide React** - Ícones

## 📋 Funcionalidades

- ✅ Catálogo completo de produtos com filtros
- ✅ Páginas de detalhes dos produtos
- ✅ Carrinho de compras (localStorage)
- ✅ Busca de produtos
- ✅ Blog (listagem e posts)
- ✅ Formulário de contato
- ✅ Responsivo (mobile-first)
- ✅ SEO otimizado (metadata, sitemap, robots.txt)
- ✅ Performance otimizada

## 🛠️ Instalação

1. Clone o repositório
```bash
git clone <repository-url>
cd pe-quente-calcados
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione:
```env
FORMSPREE_ID=seu_id_do_formspree  # Opcional - para formulário de contato
```

4. Execute o servidor de desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📦 Build de Produção

```bash
npm run build
npm start
```

## 🚀 Deploy no Vercel

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel:
   - `FORMSPREE_ID` (opcional)
3. Deploy automático a cada push para a branch principal

### Variáveis de Ambiente Recomendadas

- `FORMSPREE_ID` - ID do formulário Formspree (para envio de emails do formulário de contato)

## 📁 Estrutura do Projeto

```
/app
  /api/contact        # API route para formulário de contato
  /blog               # Páginas do blog
  /carrinho           # Página do carrinho
  /contato            # Formulário de contato
  /faq                # FAQ
  /produtos           # Catálogo e detalhes de produtos
  /sobre              # Sobre a loja
  /minha-conta        # Área do cliente (stub)
  layout.tsx          # Layout raiz
  page.tsx            # Home page

/components
  /sections           # Seções da home page
  /Products           # Componentes de produtos
  /product            # Componentes de detalhe do produto
  /cart               # Componentes do carrinho
  /Header             # Header/navegação
  /Footer             # Footer
  /Hero               # Hero banner

/data                 # Dados JSON (produtos, categorias, marcas)
/lib                  # Utilitários e API helpers
/store                # Zustand stores (carrinho)
/types                # Definições TypeScript
```

## 🎨 Cores da Marca

- **Vermelho**: `#FF0000` - Cor principal
- **Azul Escuro**: `#00008B` - Cor secundária
- **Amarelo**: `#FFD700` - Apenas no logo (square)
- **Background**: `#0a0a0a` (preto)
- **Cards**: `#1a1a1a` / `#252525`

## 📝 Notas Importantes

- O site é uma **vitrine local** - produtos são para retirada na loja
- Não há entrega/frete - foco em retirada local
- Carrinho salvo no `localStorage` do navegador
- Dados de produtos estão em `/data/products.json` (podem ser migrados para CMS no futuro)

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm start` - Servidor de produção
- `npm run lint` - Linter
- `npm run type-check` - Verificação de tipos TypeScript

## 📞 Contato da Loja

- **Endereço**: Praça Garcia 136/140, Paraíba do Sul - RJ
- **Telefone**: (24) 99999-9999
- **Horário**: Segunda a Sexta: 9h às 18h | Sábado: 9h às 13h

## 📄 Licença

Este projeto é privado e proprietário.

## 🔮 Futuras Melhorias

- Integração com CMS (Strapi, Contentful)
- Sistema de autenticação de usuários
- Favoritos/wishlist
- Sistema de avaliações de produtos
- Integração com gateway de pagamento (se necessário)
- Dashboard administrativo
