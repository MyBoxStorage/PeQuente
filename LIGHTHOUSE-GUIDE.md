# 🚀 Guia Prático - Como Executar o Lighthouse

## 📋 Pré-requisitos

1. **Build de produção feito:**
   ```bash
   npm run build
   ```

2. **Servidor de produção rodando:**
   ```bash
   npm start
   ```
   ⚠️ **IMPORTANTE:** Mantenha este terminal aberto enquanto executa o teste!

## 🎯 Método 1: Chrome DevTools (Mais Fácil - RECOMENDADO)

### Passo a Passo:

1. **Com o servidor rodando** (`npm start`), abra o Chrome
2. Acesse: `http://localhost:3000`
3. Pressione **F12** (ou **Cmd+Option+I** no Mac)
4. Clique na aba **"Lighthouse"**
5. Selecione as categorias:
   - ✅ Performance
   - ✅ Acessibilidade  
   - ✅ SEO
   - ✅ Best Practices (opcional)
6. Escolha o dispositivo:
   - **Desktop** (para testes em desktop)
   - **Mobile** (para testes em dispositivos móveis)
7. Clique em **"Analyze page load"**
8. Aguarde 30-60 segundos
9. Veja o relatório completo com pontuações e recomendações!

### Vantagens:
- ✅ Interface visual fácil
- ✅ Gráficos e visualizações
- ✅ Recomendações detalhadas
- ✅ Não precisa instalar nada extra

---

## 💻 Método 2: Script PowerShell (Automático)

### Passo a Passo:

1. **Com o servidor rodando** em um terminal, abra **outro terminal**
2. Navegue até a pasta do projeto:
   ```bash
   cd C:\Users\pc\pe-quente-calcados
   ```
3. Execute o script:
   ```powershell
   .\lighthouse-test.ps1
   ```
4. Aguarde o teste completar
5. Abra o arquivo HTML gerado em `lighthouse-reports/` para ver o relatório completo

### Vantagens:
- ✅ Automático
- ✅ Gera relatórios HTML e JSON
- ✅ Salva com timestamp

---

## 🔧 Método 3: CLI Manual

### Passo a Passo:

1. **Com o servidor rodando**, abra outro terminal
2. Execute:
   ```bash
   npx lighthouse http://localhost:3000 --view
   ```
3. Isso abrirá o relatório automaticamente no navegador

### Para salvar relatório:
```bash
# Salvar HTML
npx lighthouse http://localhost:3000 --output=html --output-path=./report.html

# Salvar JSON
npx lighthouse http://localhost:3000 --output=json --output-path=./report.json

# Ambos
npx lighthouse http://localhost:3000 --output=html,json --output-path=./report
```

### Opções úteis:
```bash
# Apenas Performance
npx lighthouse http://localhost:3000 --only-categories=performance --view

# Apenas Acessibilidade e SEO
npx lighthouse http://localhost:3000 --only-categories=accessibility,seo --view

# Simular mobile
npx lighthouse http://localhost:3000 --preset=desktop --view
npx lighthouse http://localhost:3000 --preset=mobile --view
```

---

## 📊 Como Interpretar os Resultados

### Pontuações Esperadas para Seu Projeto:

```
✅ Performance: 95+/100 (Objetivo)
✅ Acessibilidade: 100/100 (Objetivo)
✅ SEO: 100/100 (Objetivo)
✅ Best Practices: 90+/100 (Ideal)
```

### O que cada pontuação significa:

- **90-100 (Verde)**: Excelente! ✅
- **50-89 (Laranja)**: Precisa melhorar ⚠️
- **0-49 (Vermelho)**: Precisa atenção urgente ❌

### Métricas de Performance (Core Web Vitals):

- **LCP (Largest Contentful Paint)**: < 2.5s = ✅ Bom
- **FID/INP (First Input Delay)**: < 100ms = ✅ Bom
- **CLS (Cumulative Layout Shift)**: < 0.1 = ✅ Bom

---

## 🐛 Problemas Comuns

### Erro: "CHROME_INTERSTITIAL_ERROR"
**Causa:** Servidor não está rodando ou não está acessível  
**Solução:** 
1. Certifique-se que executou `npm run build` e `npm start`
2. Verifique se o servidor está respondendo: abra `http://localhost:3000` no navegador
3. Aguarde alguns segundos após iniciar o servidor

### Erro: "Port 3000 already in use"
**Causa:** Já existe um servidor rodando na porta 3000  
**Solução:**
```bash
# Encontrar processo usando a porta
netstat -ano | findstr :3000

# Parar processo (substitua PID pelo número)
taskkill /PID <PID> /F

# Ou use outra porta
npm start -- -p 3001
```

### Lighthouse muito lento
**Solução:** Use `--chrome-flags="--headless"` para modo headless (mais rápido)

---

## 🎯 Checklist de Testes

Antes de executar o Lighthouse, certifique-se:

- [ ] Build de produção feito (`npm run build`)
- [ ] Servidor rodando (`npm start`)
- [ ] Site acessível em `http://localhost:3000`
- [ ] Navegador Chrome instalado (necessário para Lighthouse)

---

## 📝 Dicas Finais

1. **Sempre teste em produção:** Use `npm run build && npm start`, não `npm run dev`
2. **Teste em diferentes dispositivos:** Use Desktop e Mobile no Lighthouse
3. **Compare resultados:** Execute testes antes e depois de otimizações
4. **Salve relatórios:** Guarde os relatórios HTML para comparação futura
5. **Foque nas oportunidades:** O Lighthouse mostra exatamente o que melhorar

---

## 🚀 Próximos Passos

Após executar o teste:

1. **Analise as pontuações** - Verifique se atingiu os objetivos
2. **Revise as oportunidades** - O Lighthouse mostra o que melhorar
3. **Priorize melhorias** - Foque primeiro em Performance e Acessibilidade
4. **Teste novamente** - Execute após fazer melhorias

---

**Boa sorte com os testes! 🎉**
