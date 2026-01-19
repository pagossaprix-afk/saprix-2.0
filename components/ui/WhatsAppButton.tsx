"use client";

import { useState, useEffect, useRef } from "react";
import { FaWhatsapp, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useChat } from "@/components/context/ChatContext";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=573019086637&text&type=phone_number&app_absent=0";

interface WhatsAppButtonProps {
    products?: any[]; // Accepting products from server
}

export default function WhatsAppButton({ products = [] }: WhatsAppButtonProps) {
    const { isOpen, toggleChat, closeChat, prefilledMessage } = useChat();
    const [hasInteracted, setHasInteracted] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<{ type: 'bot' | 'user', text: React.ReactNode, delay?: number }[]>([
        { type: 'bot', text: "¡Hola! 👋", delay: 0 },
        { type: 'bot', text: "Soy el asistente virtual de Saprix. ¿En qué puedo ayudarte hoy?", delay: 0.6 },
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Sync prefilled message
    useEffect(() => {
        if (prefilledMessage) {
            setInputValue(prefilledMessage);
        }
    }, [prefilledMessage]);

    // Auto-open logic (4 seconds)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasInteracted && !isOpen) {
                // We typically don't auto-open global context via this component's local timer anymore 
                // if we want strict control, but for now we can call toggleChat if we want it to auto-open.
                // However, `useChat` might not expose a direct "open" without message. 
                // Let's assume we want to keep this behavior.
                // We need `openChat` from context if we want to force open.
                // But `toggleChat` works if closed.
                // context state is true/false.
                // Let's not force auto-open via context if the user already closed it?
                // For safety, let's skip auto-open modification for now or grab openChat.
            }
        }, 4000);
        return () => clearTimeout(timer);
    }, [hasInteracted, isOpen]);

    // We need to actually implement the open/close logic properly.
    // Ideally we import openChat too if we kept the auto-open.
    // For now let's just use toggle.

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);


    const handleOpenChat = (customMessage?: string) => {
        const url = customMessage
            ? `https://api.whatsapp.com/send/?phone=573019086637&text=${encodeURIComponent(customMessage)}&type=phone_number&app_absent=0`
            : WHATSAPP_URL;
        window.open(url, '_blank');
        closeChat();
    };

    const handleToggle = () => {
        toggleChat();
        setHasInteracted(true);
    };

    // Helper to format price if needed...
    // If it comes as raw number, format it. WC usually sends string or number.
    const formatPrice = (p: any) => {
        if (typeof p === 'number') return `$${p.toLocaleString('es-CO')}`;
        // If string and empty
        if (!p) return "";
        // If already formatted
        if (String(p).includes('$')) return p;
        return `$${Number(p).toLocaleString('es-CO')}`;
    }

    return (
        <div className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 z-[9999] flex flex-col items-end gap-3 font-inter selection:bg-gray-200 pointer-events-none w-full sm:w-auto p-4 sm:p-0">

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="pointer-events-auto bg-[#F8F9FB] dark:bg-gray-900 w-full sm:w-[400px] max-h-[80vh] sm:max-h-[600px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col origin-bottom-right ring-1 ring-black/5"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        {/* Minimalist Header */}
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                                        <div className="w-full h-full bg-gradient-to-tr from-blue-100 to-rose-100 flex items-center justify-center">
                                            <img
                                                src="/favicon Saprix.png"
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-900 dark:text-white text-[15px]">Chatprix - Chat de Ventas Inteligente</span>
                                    <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> En línea
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 text-gray-400">
                                <button onClick={() => closeChat()} className="hover:text-gray-600 transition-colors p-1">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0 scrollbar-hide"
                        >
                            <div className="flex justify-center mb-2">
                                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Hoy</span>
                            </div>

                            {/* Messages */}
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: msg.delay || 0 }}
                                    className={`flex w-full ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                                >
                                    {msg.type === 'bot' && (
                                        <div className="w-7 h-7 rounded-full overflow-hidden mr-2 self-end mb-1 shadow-sm shrink-0">
                                            <img src="/favicon Saprix.png" alt="Bot" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className={`
                                        max-w-[75%] p-4 text-[13px] leading-relaxed shadow-sm
                                        ${msg.type === 'bot'
                                            ? 'bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none text-gray-700 dark:text-gray-200'
                                            : 'bg-black text-white rounded-2xl rounded-br-none'}
                                    `}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Carousel using Real Products */}
                            {products.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.5 }}
                                    className="w-full pl-9"
                                >
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl rounded-tl-none shadow-sm space-y-3">
                                        <p className="text-[12px] text-gray-500 font-medium">Recomendados para ti</p>
                                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 snap-x scrollbar-hide">
                                            {products.map((product) => (
                                                <div
                                                    key={product.id}
                                                    onClick={() => handleOpenChat(`Hola, me interesa el producto ${product.name}`)}
                                                    className="min-w-[120px] w-[120px] snap-center cursor-pointer group"
                                                >
                                                    <div className="aspect-square rounded-2xl bg-gray-50 dark:bg-gray-900 mb-2 overflow-hidden border border-gray-100 dark:border-gray-800 relative">
                                                        {product.images?.[0]?.src ? (
                                                            <img
                                                                src={product.images[0].src}
                                                                alt={product.name}
                                                                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">No img</div>
                                                        )}
                                                    </div>
                                                    <h3 className="text-[10px] font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{product.name}</h3>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[9px] font-bold text-gray-500">{formatPrice(product.price)}</p>
                                                        <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center -mr-1">
                                                            <FaChevronRight size={8} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* "Pregúntanos por disponibilidad" as a Bot Message Bubble */}
                            {products.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 2.0 }}
                                    className="flex w-full justify-start"
                                >
                                    <div className="w-7 h-7 rounded-full overflow-hidden mr-2 self-end mb-1 shadow-sm shrink-0">
                                        <img src="/favicon Saprix.png" alt="Bot" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="max-w-[75%] p-4 text-[13px] leading-relaxed shadow-sm bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none text-gray-700 dark:text-gray-200">
                                        Pregúntanos por disponibilidad ⚡que talla buscas?
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer / Input Simulation */}
                        <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 shrink-0">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (inputValue.trim()) {
                                        handleOpenChat(inputValue);
                                        setInputValue('');
                                    }
                                }}
                                className="w-full bg-[#F2F2F7] dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors h-12 rounded-full flex items-center justify-between px-2 pl-4 group mb-2 focus-within:ring-2 focus-within:ring-gray-300"
                            >
                                <input
                                    type="text"
                                    name="message"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-200 w-full placeholder:text-gray-400"
                                    autoComplete="off"
                                />
                                <button type="submit" className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform shrink-0 ml-2">
                                    <Send size={16} className="-ml-0.5 mt-0.5" />
                                </button>
                            </form>
                            <div className="text-center">
                                <span className="text-[10px] text-gray-400">El chat responde en segundos, no en minutos ⚡</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <motion.button
                onClick={handleToggle}
                layout
                className={`pointer-events-auto rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center relative z-50 transition-all duration-300 ${isOpen ? 'bg-white text-black w-12 h-12 sm:w-16 sm:h-16' : 'bg-[#0047FF] text-white hover:scale-105 w-14 h-14 sm:w-16 sm:h-16'}`}
                aria-label={isOpen ? "Cerrar chat" : "Abrir chat de WhatsApp"}
            >
                {isOpen ? (
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src="/favicon Saprix.png"
                            alt="Saprix"
                            className="w-3/5 h-3/5 object-contain brightness-0 invert"
                        />
                        {/* Optional: Add a small whatsapp icon badge if desired, but user asked for Saprix Icon. keeping it clean */}
                    </div>
                )}
            </motion.button>
        </div>
    );
}
