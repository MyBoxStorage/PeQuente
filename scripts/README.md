# Scripts de Gerenciamento

## Download de Imagens de Produtos

Este script baixa automaticamente todas as imagens de produtos que estão referenciadas no `products.json`.

### Como usar:

```bash
npm run download-images
```

Ou diretamente:

```bash
node scripts/download-product-images.js
```

### O que o script faz:

1. ✅ Lê o arquivo `data/products.json`
2. ✅ Extrai todas as URLs de imagens únicas
3. ✅ Verifica quais imagens já existem localmente
4. ✅ Baixa apenas as imagens que não existem ou que são URLs externas
5. ✅ Salva as imagens em `public/images/produtos/`
6. ✅ Mostra um resumo do processo (baixados, ignorados, falhas)

### Características:

- ⏱️ Delay de 300ms entre downloads (evita sobrecarga)
- 🔄 Suporta redirecionamentos HTTP
- ⏰ Timeout de 30 segundos por imagem
- 📊 Relatório detalhado ao final
- 🔍 Verifica arquivos existentes antes de baixar
- ❌ Lista imagens que falharam ao baixar

### Observações:

- O script cria o diretório `public/images/produtos/` automaticamente se não existir
- Imagens que já existem localmente são ignoradas
- Imagens com URLs externas serão baixadas automaticamente
- O script mantém o nome original do arquivo da URL

### Formato esperado das imagens:

No `products.json`, as imagens podem estar em dois formatos:

1. **URL externa** (será baixada):
   ```json
   "images": ["https://example.com/imagem.jpg"]
   ```

2. **Caminho local** (será verificado):
   ```json
   "images": ["/images/produtos/imagem.jpg"]
   ```

### Exemplo de saída:

```
✓ 123 produtos carregados
📦 64 imagens únicas encontradas

🚀 Iniciando downloads...

✓ 1/64 - Baixado: fila-recovery-branco.jpg
✓ 2/64 - Já existe: nike-air-force-1-masculino.jpg
...
============================================================
📊 RESUMO
============================================================
✓ Baixados: 45
⊘ Ignorados (já existem): 15
✗ Falhas: 4

✅ Processo concluído!
```
