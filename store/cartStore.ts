import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getItemCount: () => number;
}

const getItemKey = (id: string, size?: string) => `${id}-${size || 'default'}`;

// Safe storage for SSR
const getStorage = () => {
  if (typeof window !== 'undefined') {
    return createJSONStorage(() => localStorage);
  }
  // Return no-op storage for SSR
  return createJSONStorage(() => ({
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  }));
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        const itemKey = getItemKey(item.productId, item.size);
        const existingItemIndex = items.findIndex(
          (i) => getItemKey(i.productId, i.size) === itemKey
        );

        if (existingItemIndex >= 0) {
          // Item já existe, aumenta a quantidade
          const updatedItems = [...items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + (item.quantity || 1),
          };
          set({ items: updatedItems });
        } else {
          // Novo item
          set({
            items: [
              ...items,
              {
                ...item,
                id: itemKey,
                quantity: item.quantity || 1,
              },
            ],
          });
        }
      },

      removeItem: (id, size) => {
        const { items } = get();
        const itemKey = getItemKey(id, size);
        set({
          items: items.filter((item) => getItemKey(item.productId, item.size) !== itemKey),
        });
      },

      updateQuantity: (id, quantity, size) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }

        const { items } = get();
        const itemKey = getItemKey(id, size);
        const updatedItems = items.map((item) =>
          getItemKey(item.productId, item.size) === itemKey
            ? { ...item, quantity }
            : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getSubtotal: () => {
        return get().getTotal();
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'pe-quente-cart',
      storage: getStorage(),
    }
  )
);
