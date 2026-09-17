"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem, CartItem, OrderType } from "@/types";

interface CartContextType {
  items: CartItem[];
  orderType: OrderType;
  tableNumber: string;
  customerNotes: string;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  addToCart: (item: MenuItem, quantity?: number, specialInstructions?: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  setTableNumber: (table: string) => void;
  setCustomerNotes: (notes: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const TAX_RATE = 0.05; // 5% Restaurant Tax

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("DINE_IN");
  const [tableNumber, setTableNumber] = useState<string>("Table 1");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dinedesk_cart");
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedOrderType = localStorage.getItem("dinedesk_orderType");
      if (storedOrderType === "DINE_IN" || storedOrderType === "TAKEAWAY") {
        setOrderType(storedOrderType);
      }
      const storedTable = localStorage.getItem("dinedesk_tableNumber");
      if (storedTable) {
        setTableNumber(storedTable);
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("dinedesk_cart", JSON.stringify(items));
      localStorage.setItem("dinedesk_orderType", orderType);
      localStorage.setItem("dinedesk_tableNumber", tableNumber);
    }
  }, [items, orderType, tableNumber, isLoaded]);

  const addToCart = (item: MenuItem, quantity: number = 1, specialInstructions?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.menuItem.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          specialInstructions: specialInstructions || updated[existingIndex].specialInstructions,
        };
        return updated;
      } else {
        return [...prev, { menuItem: item, quantity, specialInstructions }];
      }
    });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setItems((prev) =>
      prev.map((ci) =>
        ci.menuItem.id === menuItemId ? { ...ci, quantity } : ci
      )
    );
  };

  const removeFromCart = (menuItemId: string) => {
    setItems((prev) => prev.filter((ci) => ci.menuItem.id !== menuItemId));
  };

  const clearCart = () => {
    setItems([]);
    setCustomerNotes("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("dinedesk_cart");
    }
  };

  const itemCount = items.reduce((acc, ci) => acc + ci.quantity, 0);
  const subtotal = items.reduce((acc, ci) => acc + ci.menuItem.price * ci.quantity, 0);
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        orderType,
        tableNumber,
        customerNotes,
        itemCount,
        subtotal,
        tax,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setOrderType,
        setTableNumber,
        setCustomerNotes,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
