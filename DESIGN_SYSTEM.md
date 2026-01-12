# Design System - Pé Quente Calçados
## Baseline e Documentação

### Estado Atual (Baseline)

**Data da Auditoria**: Janeiro 2025

#### Problemas Identificados

1. **Tipografia**
   - Uso excessivo de `uppercase` e `tracking-widest` em CTAs e títulos
   - Inconsistência entre `font-bold`, `font-black` e `font-semibold`
   - Espaçamento de letras muito amplo em alguns elementos

2. **Cores**
   - Paleta básica definida, mas falta escala completa (50-900)
   - Cores semânticas não definidas (success, warning, error)

3. **Componentes**
   - CTAs com estilos muito variados
   - Cards com sombras inconsistentes
   - Espaçamentos não padronizados

#### Performance Baseline
- A ser medido: PageSpeed Insights
- Core Web Vitals: A verificar

---

## Design System Definido

### Paleta de Cores

#### Cores Principais
- **Vermelho**: #FF0000 (Primary) → Variações: #ff3333 (hover), #CC0000 (active)
- **Azul**: #00008B (Primary) → Variações: #1a1aff (hover), #000066 (active)
- **Amarelo**: #FFD700 (Apenas logo)

#### Backgrounds (Neutros)
- Base: #0a0a0a
- Card: #2d2d2d
- Elevated: #252525
- Border: #353535

#### Texto
- Primary: #ffffff
- Secondary: #b0b0b0
- Muted: #888888

### Tipografia

#### Hierarquia
- **H1**: 3-4rem (48-64px), font-bold, line-height: 1.25
- **H2**: 2.5-3rem (40-48px), font-bold, line-height: 1.3
- **H3**: 2rem (32px), font-semibold, line-height: 1.4
- **Body**: 1rem (16px), font-normal, line-height: 1.5
- **Small**: 0.875rem (14px), font-normal, line-height: 1.5

#### Fontes
- **Body**: Inter (sans-serif)
- **Headings**: Bebas Neue (display) - uso limitado
- **Especial**: Montserrat 900 (efeitos especiais)

#### Letter Spacing
- **Normal**: 0 (body text)
- **Wide**: 0.05em (headings grandes)
- **Evitar**: tracking-widest (0.1em+) e uppercase em textos longos

### Espaçamento (Base 4px)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### Border Radius
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- full: 9999px

### Transições
- Fast: 150ms
- Default: 250ms
- Slow: 350ms

---

## Diretrizes de Uso

### CTAs (Call-to-Actions)
- **Primário**: bg-[#FF0000], text-white, font-semibold, sem uppercase, tracking normal
- **Secundário**: bg-transparent, border, text-white, font-medium
- **Evitar**: uppercase, tracking-widest em CTAs

### Títulos
- Usar hierarquia clara (H1, H2, H3)
- Evitar uppercase em títulos longos
- Letter-spacing máximo: 0.05em

### Cards
- Background: #2d2d2d
- Border: #353535
- Border-radius: 8-12px
- Shadow: elevation.md ou elevation.lg
