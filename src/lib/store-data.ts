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
    // Demo mahsulotlar o'chirildi. Faqat real mahsulotlar ishlaydi.
];

export function formatStorePrice(amount: number): string {
    return amount.toLocaleString('uz-UZ') + ' so\'m';
}
