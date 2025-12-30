# 🎨 Instruções: Salvar Banner Completo

## ✅ Como Salvar o Banner que Você Anexou

O banner completo "ÚLTIMA CHANCE 40% OFF" precisa ser salvo no projeto:

### 📁 Local para Salvar:
```
public/images/banners/banner-ultima-chance.jpg
```

**Caminho completo:**
```
C:\Users\pc\pe-quente-calcados\public\images\banners\banner-ultima-chance.jpg
```

### 📝 Passo a Passo:

1. **Salve a imagem do banner** que você anexou (a imagem completa com tênis, texto "ÚLTIMA CHANCE", "40% OFF", etc.)
2. **Navegue até a pasta do projeto:**
   ```
   C:\Users\pc\pe-quente-calcados\public\images\banners\
   ```
3. **Salve a imagem com este nome exato:**
   ```
   banner-ultima-chance.jpg
   ```
   (ou `.png` se preferir - ajuste o código se necessário)

### 🎯 Formato Recomendado:

- **Formato**: JPG ou PNG
- **Dimensões**: 1920px × 600px (ou proporção similar 16:5)
- **Resolução**: 72-96 DPI
- **Tamanho**: Otimizado (200-500 KB)

### ✅ Após Salvar:

O código já está configurado! Após salvar a imagem:
1. Recarregue a página do site
2. O banner 1 exibirá automaticamente a nova imagem completa
3. Não precisa de nenhuma outra configuração

### 🔍 Verificar se Salvou Corretamente:

```powershell
cd C:\Users\pc\pe-quente-calcados
Test-Path "public\images\banners\banner-ultima-chance.jpg"
```

Se retornar `True`, está tudo certo!

### 📌 Nota:

O componente agora suporta dois tipos de banner:
- **`full-banner`**: Banner completo pronto (como este novo)
- **`gradient`**: Banner com gradiente e texto
- **`image`**: Banner com camadas (fundo + produto) - para uso futuro
