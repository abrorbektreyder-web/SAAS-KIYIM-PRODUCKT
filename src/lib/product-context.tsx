'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { storeProducts as fallbackProducts, type StoreProduct } from '@/lib/store-data';

type ProductContextType = {
    products: StoreProduct[];
    addProduct: (product: Omit<StoreProduct, 'id'>) => void;
    removeProduct: (id: string) => void;
    updatePrice: (id: string, newPrice: number) => void;
    updateStock: (id: string, change: number) => void;
    totalProducts: number;
    totalValue: number;
};

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({ children, initialProducts = [] }: { children: ReactNode, initialProducts?: StoreProduct[] }) {
    const [products, setProducts] = useState<StoreProduct[]>(initialProducts);

    const addProduct = useCallback((product: Omit<StoreProduct, 'id'>) => {
        setProducts((prev) => [...prev, { ...product, id: 'sp' + Date.now() }]);
    }, []);

    const removeProduct = useCallback((id: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    }, []);

    const updatePrice = useCallback((id: string, newPrice: number) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
        );
    }, []);

    const updateStock = useCallback((id: string, change: number) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, price: p.price + change } : p))
        );
    }, []);

    const totalProducts = products.length;
    const totalValue = products.reduce((s, p) => s + p.price, 0);

    return (
        <ProductContext.Provider value={{ products, addProduct, removeProduct, updatePrice, updateStock, totalProducts, totalValue }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const ctx = useContext(ProductContext);
    if (!ctx) throw new Error('useProducts must be used within ProductProvider');
    return ctx;
}
