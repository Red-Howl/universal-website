import React, { createContext, useState, useEffect } from 'react';

// 1. We create the context with a default value to prevent errors
export const CartContext = createContext({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  updateQuantity: () => {},
});

export const CartProvider = ({ children }) => {
  // 2. We ensure the state ALWAYS starts as an empty array
  const [cart, setCart] = useState([]);

  // Load cart from browser's local storage when the app starts
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('kalamkarCart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setCart([]); // If there's an error, reset to an empty cart
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('kalamkarCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const value = { cart, addToCart, removeFromCart, clearCart, updateQuantity };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};