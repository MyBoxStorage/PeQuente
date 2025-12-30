# 📸 Instruções: Salvar Imagem do Tênis Sem Fundo

## ✅ Como Salvar a Imagem que Você Já Tem

A imagem PNG sem fundo que você anexou precisa ser salva no projeto com o nome correto:

### 📁 Local para Salvar:
```
public/images/produtos/tenis-adidas-adizero-drive-rc-masculino-transparente.png
```

### 📝 Passo a Passo:

1. **Copie a imagem** que você tem (a que está sem fundo)
2. **Navegue até a pasta do projeto:**
   ```
   C:\Users\pc\pe-quente-calcados\public\images\produtos\
   ```
3. **Salve a imagem com este nome exato:**
   ```
   tenis-adidas-adizero-drive-rc-masculino-transparente.png
   ```
4. **Certifique-se de que:**
   - O arquivo tem extensão `.png` (não `.jpg`)
   - O nome está exatamente como acima
   - A imagem realmente tem fundo transparente

### 🔍 Verificar se Salvou Corretamente:

Depois de salvar, você pode verificar com este comando no PowerShell:
```powershell
cd C:\Users\pc\pe-quente-calcados
Test-Path "public\images\produtos\tenis-adidas-adizero-drive-rc-masculino-transparente.png"
```

Se retornar `True`, a imagem está salva corretamente!

### 🎨 O Código Já Está Configurado:

O componente `HeroBanner.tsx` já está configurado para:
- ✅ Usar a imagem PNG transparente quando disponível
- ✅ Fazer fallback automático para JPG se PNG não existir
- ✅ Enquadrar o tênis de forma harmoniosa no banner
- ✅ Adicionar sombras e efeitos de profundidade

### 🚀 Após Salvar:

Após salvar a imagem, o banner automaticamente usará a versão sem fundo!
Recarregue a página do site para ver a mudança.
