// Mock ma'lumotlar - O'zbek tilidagi demo data

export type Store = {
  id: string;
  name: string;
  location: string;
  status: 'faol' | 'nofaol';
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
};

export type Product = {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  size: string[];
  color: string[];
  status: 'faol' | 'nofaol';
};

export type Order = {
  id: string;
  storeId: string;
  customerName: string;
  customerPhone: string;
  products: string[];
  total: number;
  status: 'yangi' | 'tayyorlanmoqda' | 'yetkazildi' | 'bekor qilindi';
  date: string;
};

export type Customer = {
  id: string;
  storeId: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
};

// Do'konlar
export const stores: Store[] = [
  { id: 's1', name: 'HOYR Chilonzor', location: 'Toshkent, Chilonzor', status: 'faol', totalRevenue: 45600000, totalOrders: 312, totalProducts: 128 },
  { id: 's2', name: 'HOYR Yunusobod', location: 'Toshkent, Yunusobod', status: 'faol', totalRevenue: 38200000, totalOrders: 241, totalProducts: 96 },
  { id: 's3', name: 'HOYR Samarqand', location: 'Samarqand, Siyob bozor', status: 'faol', totalRevenue: 27900000, totalOrders: 189, totalProducts: 74 },
  { id: 's4', name: 'HOYR Namangan', location: 'Namangan, Markaziy', status: 'nofaol', totalRevenue: 12300000, totalOrders: 87, totalProducts: 45 },
];

// Mahsulotlar
export const products: Product[] = [
  { id: 'p1', storeId: 's1', name: 'Erkaklar ko\'ylagi - Klassik', category: 'Ko\'ylak', price: 189000, stock: 45, size: ['S', 'M', 'L', 'XL'], color: ['Oq', 'Ko\'k', 'Qora'], status: 'faol' },
  { id: 'p2', storeId: 's1', name: 'Ayollar ko\'ylagі - Gul naqshli', category: 'Ko\'ylak', price: 215000, stock: 32, size: ['XS', 'S', 'M', 'L'], color: ['Qizil', 'Sariq', 'Pushti'], status: 'faol' },
  { id: 'p3', storeId: 's1', name: 'Jins shim - Slim fit', category: 'Shim', price: 320000, stock: 28, size: ['28', '30', '32', '34', '36'], color: ['Ko\'k', 'Qora'], status: 'faol' },
  { id: 'p4', storeId: 's1', name: 'Sport kurtka', category: 'Kurtka', price: 450000, stock: 15, size: ['M', 'L', 'XL', 'XXL'], color: ['Qora', 'Kulrang'], status: 'faol' },
  { id: 'p5', storeId: 's2', name: 'Ayollar ko\'ylagi - Ofis', category: 'Ko\'ylak', price: 275000, stock: 22, size: ['XS', 'S', 'M', 'L', 'XL'], color: ['Oq', 'Kulrang', 'Qora'], status: 'faol' },
  { id: 'p6', storeId: 's2', name: 'Bolalar to\'plami', category: 'Bolalar', price: 185000, stock: 40, size: ['86', '92', '98', '104', '110'], color: ['Rangli'], status: 'faol' },
  { id: 'p7', storeId: 's3', name: 'Milliy ko\'ylak - Atlas', category: 'Milliy', price: 520000, stock: 8, size: ['S', 'M', 'L', 'XL'], color: ['Atlas'], status: 'faol' },
  { id: 'p8', storeId: 's3', name: 'Yozgi shim - Keten', category: 'Shim', price: 165000, stock: 35, size: ['28', '30', '32', '34'], color: ['Bej', 'Oq', 'Kulrang'], status: 'faol' },
];

// Buyurtmalar
export const orders: Order[] = [
  { id: 'B-1001', storeId: 's1', customerName: 'Aziz Karimov', customerPhone: '+998901234567', products: ['Erkaklar ko\'ylagi', 'Jins shim'], total: 509000, status: 'yangi', date: '2026-02-27' },
  { id: 'B-1002', storeId: 's1', customerName: 'Malika Yusupova', customerPhone: '+998912345678', products: ['Ayollar ko\'ylagi'], total: 215000, status: 'tayyorlanmoqda', date: '2026-02-27' },
  { id: 'B-1003', storeId: 's1', customerName: 'Jasur Toshmatov', customerPhone: '+998923456789', products: ['Sport kurtka'], total: 450000, status: 'yetkazildi', date: '2026-02-26' },
  { id: 'B-1004', storeId: 's2', customerName: 'Nilufar Rahimova', customerPhone: '+998934567890', products: ['Ayollar ko\'ylagi - Ofis'], total: 275000, status: 'yangi', date: '2026-02-27' },
  { id: 'B-1005', storeId: 's2', customerName: 'Bobur Mirzaev', customerPhone: '+998945678901', products: ['Bolalar to\'plami'], total: 370000, status: 'bekor qilindi', date: '2026-02-25' },
  { id: 'B-1006', storeId: 's3', customerName: 'Zulfiya Hasanova', customerPhone: '+998956789012', products: ['Milliy ko\'ylak - Atlas'], total: 520000, status: 'yetkazildi', date: '2026-02-26' },
];

// Mijozlar
export const customers: Customer[] = [
  { id: 'c1', storeId: 's1', name: 'Aziz Karimov', phone: '+998901234567', totalOrders: 8, totalSpent: 2450000, lastOrder: '2026-02-27' },
  { id: 'c2', storeId: 's1', name: 'Malika Yusupova', phone: '+998912345678', totalOrders: 12, totalSpent: 3680000, lastOrder: '2026-02-27' },
  { id: 'c3', storeId: 's1', name: 'Jasur Toshmatov', phone: '+998923456789', totalOrders: 5, totalSpent: 1890000, lastOrder: '2026-02-26' },
  { id: 'c4', storeId: 's2', name: 'Nilufar Rahimova', phone: '+998934567890', totalOrders: 7, totalSpent: 2100000, lastOrder: '2026-02-27' },
  { id: 'c5', storeId: 's3', name: 'Zulfiya Hasanova', phone: '+998956789012', totalOrders: 3, totalSpent: 890000, lastOrder: '2026-02-26' },
];

// Dashboard grafik ma'lumotlari
export const salesData = [
  { oy: 'Sen', sotuv: 18500000, buyurtma: 142 },
  { oy: 'Okt', sotuv: 22300000, buyurtma: 168 },
  { oy: 'Noy', sotuv: 19800000, buyurtma: 155 },
  { oy: 'Dek', sotuv: 35200000, buyurtma: 267 },
  { oy: 'Yan', sotuv: 28900000, buyurtma: 219 },
  { oy: 'Fev', sotuv: 31500000, buyurtma: 243 },
];

// Pul formatlovchi
export function formatPrice(amount: number): string {
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + ' mln';
  if (amount >= 1000) return (amount / 1000).toFixed(0) + ' ming';
  return amount.toLocaleString();
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' });
}
