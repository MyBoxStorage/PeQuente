# 🔧 CORREÇÕES NECESSÁRIAS NO PROMPT DE TESTES

## Problema Identificado: Ícone "User" (Minha Conta)

### Descrição
O arquivo `PROMPT_TESTES_HEADER_PREMIUM.md` menciona um ícone "User" para "Minha Conta" que não existe no componente `HeaderPremium.tsx`.

### Evidência

1. **No Prompt de Testes**:
   - Seção menciona: "Ícone de usuário (Minha Conta)"
   - Espera encontrar link para `/minha-conta`

2. **No Código Atual** (`components/Header/HeaderPremium.tsx`):
   - Não há import de `User` de `lucide-react`
   - Não há link para `/minha-conta`
   - Apenas os ícones: Menu, X, Search, ShoppingBag, ChevronDown

3. **Comparação com Header Antigo**:
   - `components/Header/Header.tsx` possui:
     - Import: `User` de lucide-react (linha 6)
     - Link: `/minha-conta` (linha 108)
     - Ícone User renderizado (linha 113)

### Opções de Correção

#### Opção A: Remover do Prompt (RECOMENDADO se não for requisito)
Se o ícone User não é necessário no HeaderPremium:

1. Remover todas as menções ao ícone User no prompt
2. Remover testes relacionados a "Minha Conta"
3. Atualizar checklist final

**Arquivos a modificar**:
- `PROMPT_TESTES_HEADER_PREMIUM.md`

#### Opção B: Adicionar ao HeaderPremium (se for requisito)
Se o ícone User é necessário:

1. Adicionar import: `User` de lucide-react
2. Adicionar link após WhatsApp, antes do carrinho:
   ```tsx
   {/* Ícone de usuário (Minha Conta) */}
   <Link
     href="/minha-conta"
     className="text-gray-800 hover:text-[#FF0000] transition-colors duration-300 p-2 hidden sm:flex"
     aria-label="Minha Conta"
     prefetch
   >
     <User size={22} />
   </Link>
   ```

**Arquivos a modificar**:
- `components/Header/HeaderPremium.tsx`

### Recomendação
**Sugerir Opção A** (remover do prompt), a menos que o usuário confirme que o ícone User é um requisito do HeaderPremium.

---

## Outras Verificações Realizadas

✅ **Todas as outras referências no prompt estão corretas**:
- Logo, navegação, busca, carrinho, WhatsApp
- Menu mobile, dropdown produtos
- ARIA labels, touch targets
- Espaçamento, animações

---

**Data**: 2026-01-05
**Status**: Aguardando decisão do usuário sobre Opção A ou B
