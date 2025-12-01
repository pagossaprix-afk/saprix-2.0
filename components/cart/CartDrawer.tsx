"use client";

import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
    const { items, removeItem, updateQuantity, cartTotal, isOpen, toggleCart } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-gray-900 shadow-xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Tu Carrito ({items.length})
                            </h2>
                            <button
                                onClick={toggleCart}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
                                    <ShoppingBag className="w-16 h-16 opacity-20" />
                                    <p>Tu carrito está vacío</p>
                                    <button
                                        onClick={toggleCart}
                                        className="text-lime-500 hover:underline font-medium"
                                    >
                                        Seguir comprando
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div
                                        key={`${item.id}-${item.variationId || "simple"}`}
                                        className="flex gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg"
                                    >
                                        <div className="relative w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0 border dark:border-gray-700">
                                            <Image
                                                src={item.image || "/placeholder-image.png"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                                                {item.attributes && (
                                                    <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                                                        {Object.entries(item.attributes).map(([key, value]) => (
                                                            <p key={key}>
                                                                <span className="capitalize">{key}:</span> {value}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-full border dark:border-gray-700 px-2 py-1">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity - 1, item.variationId)
                                                        }
                                                        disabled={item.quantity <= 1}
                                                        className="p-0.5 hover:text-lime-500 disabled:opacity-30"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-medium w-4 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity + 1, item.variationId)
                                                        }
                                                        className="p-0.5 hover:text-lime-500"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-sm">
                                                        ${(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                    <button
                                                        onClick={() => removeItem(item.id, item.variationId)}
                                                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-full transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                                <div className="flex items-center justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${cartTotal.toLocaleString()}</span>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={toggleCart}
                                    className="block w-full bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 px-4 rounded-full text-center transition-colors"
                                >
                                    Proceder al Pago
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
