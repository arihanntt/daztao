'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type CartItem = {
  _id: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  links: string[];
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateLink: (id: string, index: number, value: string) => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('daztao_cart');
    if (saved) setCart(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('daztao_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product: any) => {
    // Sub-Phase 8.1: read the profileLink captured on the product page
    const capturedLink: string = product.profileLink?.trim() ?? '';

    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1, links: [...item.links, capturedLink] }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          slug: product.slug,
          title: product.title,
          price: product.price,
          image: product.images[0],
          quantity: 1,
          links: [capturedLink],
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          const newLinks = [...item.links];
          while (newLinks.length < newQty) newLinks.push('');
          while (newLinks.length > newQty) newLinks.pop();
          return { ...item, quantity: newQty, links: newLinks };
        }
        return item;
      })
    );
  };

  const updateLink = (id: string, index: number, value: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const newLinks = [...item.links];
          newLinks[index] = value;
          return { ...item, links: newLinks };
        }
        return item;
      })
    );
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateLink,
        cartTotal,
        cartCount,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}