"use strict";
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of the product context data we need
interface ProductContextData {
    id: number | string;
    name: string;
    price: string | number;
    permalink?: string;
}

interface ChatContextType {
    isOpen: boolean;
    openChat: (message?: string) => void;
    closeChat: () => void;
    toggleChat: () => void;
    setProductContext: (product: ProductContextData | null) => void;
    productContext: ProductContextData | null;
    prefilledMessage: string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [productContext, setProductContext] = useState<ProductContextData | null>(null);
    const [prefilledMessage, setPrefilledMessage] = useState("");

    const openChat = (message?: string) => {
        setIsOpen(true);
        if (message) {
            setPrefilledMessage(message);
        } else if (productContext) {
            setPrefilledMessage(`Hola, estoy viendo ${productContext.name}. ¿Tienen disponibilidad en talla...?`);
        } else {
            setPrefilledMessage("");
        }
    };

    const closeChat = () => setIsOpen(false);
    const toggleChat = () => setIsOpen(prev => !prev);

    // Update prefilled message when product context changes
    useEffect(() => {
        if (productContext) {
            // We don't necessarily want to override if the user already typed something, 
            // but for "initial open" it's good.
            // Let's just keep the context ready.
        }
    }, [productContext]);

    return (
        <ChatContext.Provider value={{
            isOpen,
            openChat,
            closeChat,
            toggleChat,
            setProductContext,
            productContext,
            prefilledMessage
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
