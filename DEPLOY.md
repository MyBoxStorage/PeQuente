# Guia de Deploy - Pé Quente Calçados

## 📋 Checklist Pré-Deploy

### 1. Variáveis de Ambiente
- [ ] Criar arquivo `.env.local` (não commitar)
- [ ] Configurar `FORMSPREE_ID` (opcional, para formulário de contato)

### 2. Testes Locais
- [ ] Executar `npm run build` sem erros
- [ ] Testar responsividade em mobile/tablet/desktop
- [ ] Testar funcionalidade do carrinho
- [ ] Testar formulário de contato
- [ ] Verificar todas as páginas principais
- [ ] Testar filtros na página de produtos

### 3. Otimizações
- [ ] Verificar que todas as imagens estão otimizadas
- [ ] Verificar performance (Lighthouse)
- [ ] Confirmar que sitemap.xml está acessível
- [ ] Confirmar que robots.txt está configurado

## 🚀 Deploy no Vercel

### Opção 1: Deploy via GitHub (Recomendado)

1. **Preparar Repositório**
   ```bash
   git add .
   git commit -m "Preparando para deploy"
   git push origin main
   ```

2. **Conectar no Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub
   - Clique em "Add New Project"
   - Importe o repositório
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `.` (raiz)
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next` (padrão)

3. **Configurar Variáveis de Ambiente**
   - No painel do projeto no Vercel
   - Vá em Settings > Environment Variables
   - Adicione:
     - `FORMSPREE_ID` (se usar Formspree)

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Acesse o link fornecido

### Opção 2: Deploy via Vercel CLI

1. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy de Produção**
   ```bash
   vercel --prod
   ```

## 🔧 Configuração do Formspree (Opcional)

Se quiser habilitar o envio real de emails do formulário de contato:

1. Acesse [formspree.io](https://formspree.io)
2. Crie uma conta gratuita
3. Crie um novo formulário
4. Copie o Form ID
5. Adicione no Vercel como variável de ambiente: `FORMSPREE_ID`

**Nota**: Sem Formspree, o formulário ainda funciona, mas apenas registra no console (modo desenvolvimento).

## ✅ Pós-Deploy

### Verificações

- [ ] Site está acessível
- [ ] Todas as rotas funcionam
- [ ] Imagens carregam corretamente
- [ ] Formulário de contato funciona
- [ ] Carrinho funciona
- [ ] SEO (verificar meta tags)
- [ ] Performance (Lighthouse)

### Domínio Customizado (Opcional)

1. No Vercel, vá em Settings > Domains
2. Adicione seu domínio
3. Siga as instruções para configurar DNS

### Monitoramento

- Configure Vercel Analytics (opcional)
- Configure uptime monitoring (opcional)
- Configure error tracking (Sentry, etc.) se necessário

## 🐛 Troubleshooting

### Build Fails
- Verificar logs do build no Vercel
- Testar build localmente: `npm run build`
- Verificar dependências: `npm install`

### Página 404
- Verificar que todas as rotas estão corretas
- Verificar `generateStaticParams` para rotas dinâmicas

### Imagens não carregam
- Verificar que imagens estão em `/public/images`
- Verificar paths das imagens no código
- Verificar configuração do `next.config.ts`

### Formulário não envia
- Verificar `FORMSPREE_ID` está configurado
- Verificar logs do Vercel Functions
- Testar endpoint `/api/contact` diretamente

## 📊 Performance

Após o deploy, verifique:
- Core Web Vitals (Google Search Console)
- Lighthouse Score
- Tempo de carregamento
- Otimização de imagens

## 🔄 Atualizações Futuras

Para atualizar o site:
1. Faça as alterações no código
2. Commit e push para GitHub
3. Vercel fará deploy automático

Ou manualmente:
```bash
vercel --prod
```
