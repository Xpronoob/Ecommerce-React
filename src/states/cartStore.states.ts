import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useUserStore } from './userStore.states';
import { ProductService } from '@/services/Public/product.service';
import { CartItemsModel } from '@/models/cart-items.model';

interface CartState {
  items: CartItemsModel[];
  addItem: (item: CartItemsModel, quantity: number, queryClient: any) => void;
  setItems: (items: CartItemsModel[]) => void;
  incrementQuantity: (
    cart_items_id: number,
    product_details_id: number
  ) => void;
  decrementQuantity: (
    cart_items_id: number,
    product_details_id: number
  ) => void;
  removeItem: (
    cart_items_id: number,
    product_details_id: number
  ) => Promise<void>;
  clearCart: () => void;
  syncUserCartInAuthentication: () => void;
  syncUserCart: () => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        items: [],

        addItem: async (item) => {
          const user = useUserStore.getState().user;

          if (user) {
            await ProductService.addProductToCart(item);
          }

          set((state) => {
            const existingItem = state.items.find(
              (existingItem) =>
                existingItem.product_details_id === item.product_details_id
            );

            if (existingItem) {
              return {
                items: state.items.map((existingItem) =>
                  existingItem.product_details_id === item.product_details_id
                    ? {
                        ...existingItem,
                        quantity: existingItem.quantity + item.quantity
                      }
                    : existingItem
                )
              };
            }

            return {
              items: [...state.items, item]
            };
          });
        },

        setItems: (items) => {
          set({ items });
        },

        incrementQuantity: (cart_items_id, product_details_id) => {
          set((state) => ({
            items: state.items.map((item) =>
              item.product_details_id === product_details_id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          }));
        },

        decrementQuantity: (cart_items_id, product_details_id) => {
          set((state) => ({
            items: state.items.map((item) =>
              item.product_details_id === product_details_id &&
              item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          }));
        },

        removeItem: async (cart_items_id, product_details_id) => {
          const user = useUserStore.getState().user;
          if (user?.accessToken) {
            await ProductService.removeProductFromCart(cart_items_id);
          }
          set((state) => ({
            items: state.items.filter(
              (item) => item.product_details_id !== product_details_id
            )
          }));
        },

        clearCart: () => {
          set({ items: [] });
        },

        syncUserCartInAuthentication: async () => {
          const user = useUserStore.getState().user;
          if (user?.accessToken) {
            const cart = await ProductService.getCart();
            if (cart.cartItems.length > 0) {
              set({ items: cart.cartItems });
            } else {
              const currentItems = useCartStore.getState().items;
              await Promise.all(
                currentItems.map(async (item: CartItemsModel) => {
                  try {
                    await ProductService.addProductToCart(item);
                    // console.log(`Producto agregado:`, item);
                  } catch (error) {
                    console.error(`Error al agregar producto:`, item, error);
                  }
                })
              );
            }
          }
        },

        syncUserCart: async () => {
          const user = useUserStore.getState().user;
          if (user?.accessToken) {
            const cart = await ProductService.getCart();
            if (cart.cartItems.length > 0) {
              set({ items: cart.cartItems });
            } else {
              set({ items: [] });
            }
          }
        }
      }),
      { name: 'cart-items' } // Key in localStorage
    ),
    { name: 'CartStore' }
  )
);
