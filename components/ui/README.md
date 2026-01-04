# Componentes UI

Este diretório contém componentes UI reutilizáveis baseados no shadcn/ui.

## Sheet

Componente Sheet para exibir conteúdo lateral (sidebar/drawer).

### Importação

```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet"
```

### Exemplo Básico

```tsx
'use client'

import { Button } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function ExampleSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Abrir</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Título do Sheet</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          Conteúdo aqui
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

### Exemplo com Carrinho

```tsx
'use client'

import { ShoppingBag } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCartStore } from "@/store/cartStore"

export function CartSheet() {
  const { items, total } = useCartStore()
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative">
          <ShoppingBag />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs">
              {items.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Carrinho de Compras</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          {/* Lista de itens do carrinho */}
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

### Props Disponíveis

#### SheetContent

- `side`: `"top" | "right" | "bottom" | "left"` - Lado onde o sheet aparece (padrão: "right")
- `className`: Classes CSS adicionais

### Personalização

Você pode personalizar o tamanho usando classes Tailwind:

```tsx
<SheetContent className="w-[400px] sm:w-[540px]">
  {/* Conteúdo */}
</SheetContent>
```
