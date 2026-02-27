// Do'kon (kassir/user) dashboardi uchun mock data

export type StoreProduct = {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    label?: string;
};

// Kategoriyalar (Pets, Electronics, Stickers OLIB TASHLANDI)
export const storeCategories = [
    'Barchasi',
    'Sumkalar',
    'Oyoq kiyim',
    'Bosh kiyim',
    'Hudi',
    'Kurtkalar',
    'Bolalar',
    'Ko\'ylaklar',
    'Shimlar',
];

// Saralash variantlari
export const sortOptions = [
    { value: 'relevance', label: 'Mashhurlik' },
    { value: 'trending', label: 'Trend' },
    { value: 'latest', label: 'Yangi kelganlar' },
    { value: 'price_asc', label: 'Narx: past → yuqori' },
    { value: 'price_desc', label: 'Narx: yuqori → past' },
];

// Kiyim mahsulotlari (placeholder rasm URL lar bilan)
export const storeProducts: StoreProduct[] = [
    { id: 'sp1', name: 'Klassik erkaklar ko\'ylagi', category: 'Ko\'ylaklar', price: 189000, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop', label: 'Yangi' },
    { id: 'sp2', name: 'Ayollar atlas ko\'ylagi', category: 'Ko\'ylaklar', price: 275000, image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=400&fit=crop' },
    { id: 'sp3', name: 'Sport hudi - Premium', category: 'Hudi', price: 320000, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', label: 'Mashhur' },
    { id: 'sp4', name: 'Qishki kurtka', category: 'Kurtkalar', price: 650000, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
    { id: 'sp5', name: 'Charm sumka', category: 'Sumkalar', price: 420000, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
    { id: 'sp6', name: 'Sport oyoq kiyim', category: 'Oyoq kiyim', price: 380000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', label: 'Trend' },
    { id: 'sp7', name: 'Erkaklar bosh kiyimi', category: 'Bosh kiyim', price: 95000, image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=400&fit=crop' },
    { id: 'sp8', name: 'Bolalar sport to\'plami', category: 'Bolalar', price: 185000, image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=400&fit=crop' },
    { id: 'sp9', name: 'Klassik shim', category: 'Shimlar', price: 245000, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
    { id: 'sp10', name: 'Jins shim - Slim fit', category: 'Ko\'ylaklar', price: 310000, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop' },
    { id: 'sp11', name: 'Charm charm kurtka', category: 'Kurtkalar', price: 890000, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop', label: 'Premium' },
    { id: 'sp12', name: 'Ayollar hudi', category: 'Hudi', price: 245000, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop' },
];

export function formatStorePrice(amount: number): string {
    return amount.toLocaleString('uz-UZ') + ' so\'m';
}
