'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Define what a Cart Item looks like
type CartItem = {
  _id: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  links: string[]; // Custom links for each keychain
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateLink: (id: string, index: number, value: string) => void;
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('daztao_cart');
    if (saved) setCart(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  // 2. Save to LocalStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('daztao_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // --- ACTIONS ---

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        // Increment quantity if exists
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1, links: [...item.links, ''] }
            : item
        );
      }
      // Add new item
      return [...prev, {
        _id: product._id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        links: ['']
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map((item) => {
      if (item._id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        // Adjust links array size
        const newLinks = [...item.links];
        while (newLinks.length < newQty) newLinks.push('');
        while (newLinks.length > newQty) newLinks.pop();
        
        return { ...item, quantity: newQty, links: newLinks };
      }
      return item;
    }));
  };

  const updateLink = (id: string, index: number, value: string) => {
    setCart((prev) => prev.map((item) => {
      if (item._id === id) {
        const newLinks = [...item.links];
        newLinks[index] = value;
        return { ...item, links: newLinks };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateLink, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}