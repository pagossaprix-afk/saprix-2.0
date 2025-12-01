"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    variationId?: number;
    attributes?: Record<string, string>;
    slug: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: number, variationId?: number) => void;
    updateQuantity: (id: number, quantity: number, variationId?: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
    isOpen: boolean;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem("saprix-cart");
            if (stored) {
                setItems(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load cart from localStorage", e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("saprix-cart", JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (newItem: CartItem) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) => item.id === newItem.id && item.variationId === newItem.variationId
            );

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex].quantity += newItem.quantity;
                return updated;
            }
            return [...prev, newItem];
        });
        setIsOpen(true); // Open cart when adding item
    };

    const removeItem = (id: number, variationId?: number) => {
        setItems((prev) =>
            prev.filter((item) => !(item.id === id && item.variationId === variationId))
        );
    };

    const updateQuantity = (id: number, quantity: number, variationId?: number) => {
        if (quantity < 1) return;
        setItems((prev) =>
            prev.map((item) =>
                item.id === id && item.variationId === variationId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const toggleCart = () => setIsOpen((prev) => !prev);

    const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
                isOpen,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
