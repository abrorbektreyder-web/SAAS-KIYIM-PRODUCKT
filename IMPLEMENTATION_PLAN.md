# 📋 HOYR SaaS — To'liq Amalga Oshirish Rejasi (Implementation Plan)

> **Loyiha**: HOYR — Kiyim do'konlari uchun Multi-Tenant SaaS platforma
> **Texnologiyalar**: Next.js 16, TypeScript, Supabase (PostgreSQL + Auth), Tailwind-free (vanilla CSS), Vercel
> **Arxitektura**: Multi-Tenant (bitta server, ko'p do'konlar)
> **Repozitoriy**: https://github.com/abrorbektreyder-web/SAAS-KIYIM-PRODUCKT
> **Loyiha papkasi**: `my-app/` (root directory)

---

## 📁 Hozirgi loyiha tuzilmasi

```
my-app/
├── src/
│   ├── app/
│   │   ├── dashboard/        # Admin panel (do'kon egasi)
│   │   ├── store/            # Kassir panel (do'kon vitrinasi)
│   │   │   └── products/     # Mahsulotlar boshqaruvi
│   │   ├── login/
│   │   │   ├── page.tsx      # Kassir login
│   │   │   └── admin/
│   │   │       └── page.tsx  # Admin login
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global stillar
│   ├── components/
│   │   ├── layout/
│   │   │   └── sidebar.tsx   # Admin sidebar
│   │   ├── store/
│   │   │   └── cart-modal.tsx # Savat modali
│   │   └── ui/
│   │       └── hoyr-logo.tsx # HOYR logotipi
│   └── lib/
│       ├── data.ts           # Admin mock data
│       ├── store-data.ts     # Do'kon mock data
│       ├── cart-context.tsx   # Savat konteksti
│       └── product-context.tsx # Mahsulotlar konteksti
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🚨 MUHIM QOIDALAR (Agent uchun)

1. **Hech qachon mavjud ishlayotgan fayllarni buzma** — faqat kerakli qismlarni o'zgartir
2. **Har bir bosqichdan keyin** `npm run build` bilan tekshir — xato bo'lmasligi kerak
3. **Har bir bosqich mustaqil** — bitta bosqich tugamasa, keyingisiga o'tma
4. **Dark mode dizayn** saqlansin — `bg-[#09090b]`, `border-neutral-800`, `text-white`
5. **O'zbek tilida** — barcha UI matnlari o'zbek tilida bo'lsin
6. **Mock data** ni o'chirma — database ulangandan keyin almashtir
7. **Git**: har bir bosqichdan keyin `git add -A && git commit -m "Bosqich X: ..."` && `git push origin main`

---

# 🚀 PRO DARAJA UCHUN QILINISHI KERAK BO'LGAN VAZIFALAR VA KAMCHILIKLAR

Ushbu ro'yxat tizimni yanada mukammal "Pro" darajaga ko'tarish hamda hozirdagi vaqtinchalik va zaif yechimlarni to'g'rilash uchun eslatma sifatida yozildi:

- [ ] 1. **Rasm yuklash va Saqlash (Supabase Storage):** Hozirda mahsulot rasmlari vaqtinchalik `sku` ustuniga havola (URL) sifatida yozilmoqda. Buning o'rniga Supabase Storage (Bucket) yordamida rasmlarni to'g'ridan-to'g'ri bulutga yuklashni yo'lga qo'yish.
- [ ] 2. **Ma'lumotlar bazasi arxitekturasi:** Turkum (`category`) va belgilar (`label`) hozir vaqtinchalik `barcode` ustuni ichiga JSON holatida saqlanmoqda. Buni to'g'rilab, o'zining mustaqil ustunlari yoki bog'liqlik (relations) asosiga qaytarish.
- [ ] 3. **Sahifalash (Pagination):** Mahsulotlar, filiallar va mijozlar ro'yxati ortib borishi bilan tizim tezligi tushmasligi uchun backend (`.range()`) va frontend da sahifalash mantiqini (Pagination) joriy qilish.
- [ ] 4. **Dinamik Tariflar va Sozlamalar (Super Admin):** Hozirda Super Admin sozlamalar sahifasidagi ma'lumotlar (paketlar, logolar, SMTP qoidalar) statik (faqat vizual). Buning uchun tizimga maxsus Global Settings va Plans bazasini ulab saqlash kerak.
- [ ] 5. **Sessiya To'qnashuvi:** Admin va Kassir bitta brauzerda ishlaganda (tabdan tabga o'tganda) Supabase nomli JWT cookie'lar bir-biri bilan to'qnashib, konflikt bermoqda. Buni alohida brauzer yoki domen orqali ishlash tartibiga, yoxud cookie-nomlarini dinamik qilishga o'tkazish.
- [ ] 6. **Xavfsizlik va RLS (Row Level Security):** API'larda (DELETE/PATCH va h.k.) foydalanuvchining `organization_id` huquqlarini yanada qat'iylashtirib, birov boshqa birovning ma'lumotiga o'zgartirish kiritolmasligiga yana bir bor amin bo'lish.
- [ ] 7. **Eslatmalar va Telegram Triggerlari:** Sotuv bo'lganda yoki obuna muddati tugab qolayotganda mijozlarni va super adminni Telegram yoki Email orqali xabardor qiluvchi orqa fon (backend) skriptlarini to'liq integratsiya qilish.
- [ ] 8. **Ombor Qoldiqlari optimizatsiyasi:** Hozirda yuzaki ishlayotgan mahsulot xarididagi inventarni hisob kitob qilib ayrish holatini va har xil xatolar(stock minusga o'tib ketishi kabi)ni oldini oluvchi mustahkam himoya mexanizmini yozish.

---

# ═══════════════════════════════════════════
# 🔵 FAZA 1: DATABASE VA AUTENTIFIKATSIYA
# ═══════════════════════════════════════════

## ✅ Bosqich 1.1: Supabase o'rnatish va ulash (Bajarildi)

### Vazifa:
Supabase ni loyihaga ulash va environment variable larni sozlash.

### Aniq qadamlar:

```bash
# 1. Supabase client o'rnatish
npm install @supabase/supabase-js @supabase/ssr

# 2. Environment fayllarni yaratish
```

**Fayl yaratish**: `my-app/.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

**Fayl yaratish**: `my-app/src/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Fayl yaratish**: `my-app/src/lib/supabase/server.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options))
        },
      },
    }
  )
}
```

**Fayl yaratish**: `my-app/src/lib/supabase/admin.ts`
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### Tekshirish:
- `npm run build` — xatosiz tugashi kerak
- `.env.local` fayliga haqiqiy Supabase credentials yozilgan bo'lishi kerak
- `.gitignore` da `.env.local` bo'lishi kerak (maxfiy ma'lumotlar)

---

## ✅ Bosqich 1.2: Database schema yaratish (Bajarildi)

### Vazifa:
Supabase SQL Editor da barcha jadvallarni yaratish.

### SQL migratsiya (Supabase SQL Editor da bajarish):

```sql
-- ═══════════════════════════════════════
-- 1. ROLLAR JADVALI
-- ═══════════════════════════════════════
-- Supabase Auth avtomatik `auth.users` jadvalini yaratadi.
-- Biz qo'shimcha `profiles` jadval qilamiz.

CREATE TYPE user_role AS ENUM ('super_admin', 'store_admin', 'cashier');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'store_admin',
  organization_id UUID,  -- qaysi do'konga tegishli
  store_id UUID,          -- qaysi filialga tegishli (faqat kassir uchun)
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- 2. TASHKILOTLAR (do'kon egalari)
-- ═══════════════════════════════════════

CREATE TYPE subscription_plan AS ENUM ('starter', 'business', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'trial', 'expired', 'blocked');

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                -- "Baraka", "Elegant"
  slug TEXT UNIQUE NOT NULL,         -- "baraka", "elegant" (URL uchun)
  owner_id UUID REFERENCES auth.users(id),
  plan subscription_plan DEFAULT 'starter',
  subscription_status subscription_status DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  subscription_ends_at TIMESTAMPTZ,
  max_stores INT DEFAULT 1,         -- starter=1, business=5, premium=unlimited
  max_cashiers INT DEFAULT 2,       -- starter=2, business=10, premium=unlimited
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- 3. FILIALLAR (do'konlar)
-- ═══════════════════════════════════════

CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,               -- "Baraka Chilonzor"
  address TEXT,
  city TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- 4. TURKUMLAR (kategoriyalar)
-- ═══════════════════════════════════════

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,               -- "Ko'ylaklar", "Shimlar"
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- 5. MAHSULOTLAR
-- ═══════════════════════════════════════

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,            -- narx tiyin (so'm * 100)
  cost_price BIGINT,                -- tannarx
  sku TEXT,                         -- shtrix-kod
  barcode TEXT,                     -- shtrix-kod raqami
  image_url TEXT,
  colors TEXT[],                    -- ['Qora', 'Oq', 'Ko\'k']
  sizes TEXT[],                     -- ['S', 'M', 'L', 'XL']
  is_active BOOLEAN DEFAULT TRUE,
  label TEXT,                       -- 'Yangi', 'Trend', 'Mashhur'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- 6. OMBOR QOLDIQLARI (har bir filial uchun alohida)
-- ═══════════════════════════════════════

CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 0,
  low_stock_threshold INT DEFAULT 10,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(store_id, product_id)
);

-- ═══════════════════════════════════════
-- 7. MIJOZLAR
-- ═══════════════════════════════════════

CREATE TYPE customer_tier AS ENUM ('new', 'regular', 'vip');

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  tier customer_tier DEFAULT 'new',
  total_purchases BIGINT DEFAULT 0,
  total_orders INT DEFAULT 0,
  bonus_points INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- 8. BUYURTMALAR (SOTUVLAR)
-- ═══════════════════════════════════════

CREATE TYPE order_status AS ENUM ('new', 'preparing', 'delivered', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'transfer');

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id),
  customer_id UUID REFERENCES customers(id),
  cashier_id UUID REFERENCES auth.users(id),
  order_number TEXT NOT NULL,       -- "B-1001"
  status order_status DEFAULT 'new',
  payment_method payment_method DEFAULT 'cash',
  subtotal BIGINT NOT NULL,         -- mahsulotlar summasi
  discount BIGINT DEFAULT 0,        -- chegirma
  total BIGINT NOT NULL,            -- jami to'lov
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- 9. BUYURTMA TARKIBI (qaysi mahsulotlar)
-- ═══════════════════════════════════════

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,       -- snapshot (narx o'zgarganda ham saqlanadi)
  quantity INT NOT NULL,
  unit_price BIGINT NOT NULL,       -- sotuv narxi
  total_price BIGINT NOT NULL,      -- quantity * unit_price
  size TEXT,
  color TEXT
);

-- ═══════════════════════════════════════
-- 10. ROW LEVEL SECURITY (RLS) — xavfsizlik
-- ═══════════════════════════════════════

-- RLS yoqish
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Profil o'z profilini ko'radi
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Tashkilot a'zolari tashkilotni ko'radi
CREATE POLICY "Org members can view org" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Filiallarni ko'rish (faqat o'z tashkiloti)
CREATE POLICY "Org members can view stores" ON stores
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Mahsulotlarni ko'rish (faqat o'z tashkiloti)
CREATE POLICY "Org members can view products" ON products
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Admin mahsulot qo'shishi/o'zgartirishi
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('store_admin', 'super_admin')
    )
  );

-- Buyurtmalarni ko'rish
CREATE POLICY "Org members can view orders" ON orders
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Kassir buyurtma yaratishi
CREATE POLICY "Cashiers can create orders" ON orders
  FOR INSERT WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Mijozlarni ko'rish
CREATE POLICY "Org members can view customers" ON customers
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- ═══════════════════════════════════════
-- 11. AVTOMATIK TRIGGER LAR
-- ═══════════════════════════════════════

-- Yangi user ro'yxatdan o'tganda avtomatik profil yaratish
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), 
          COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'store_admin'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Buyurtma yaratilganda ombor qoldiq kamayishi
CREATE OR REPLACE FUNCTION decrease_inventory()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE inventory 
  SET quantity = quantity - NEW.quantity,
      updated_at = NOW()
  WHERE store_id = (SELECT store_id FROM orders WHERE id = NEW.order_id)
    AND product_id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_item_created
  AFTER INSERT ON order_items
  FOR EACH ROW EXECUTE FUNCTION decrease_inventory();
```

### Tekshirish:
- Supabase Dashboard → Table Editor da barcha jadvallar ko'rinishi kerak
- RLS policy lar faol bo'lishi kerak

---

## ✅ Bosqich 1.3: Autentifikatsiya tizimi (Bajarildi)

### Vazifa:
Login sahifalarni Supabase Auth ga ulash. 3-xil login: Super Admin, Do'kon Admin, Kassir.

### Fayl o'zgartirish: `my-app/src/lib/supabase/auth.ts`
```typescript
import { createClient } from './client'

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  
  // Profilni olish (rol aniqlash uchun)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, organization_id, store_id')
    .eq('id', data.user.id)
    .single()
  
  return { user: data.user, session: data.session, profile }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
}

export async function signUp(email: string, password: string, metadata: {
  full_name: string
  role: 'store_admin' | 'cashier'
  organization_name?: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata }
  })
  if (error) throw error
  return data
}
```

### Login sahifalarni o'zgartirish:
- `/login/page.tsx` — `signIn()` chaqiradi, `profile.role === 'cashier'` tekshiradi, `/store` ga yo'naltiradi
- `/login/admin/page.tsx` — `signIn()` chaqiradi, `profile.role === 'store_admin'` tekshiradi, `/dashboard` ga yo'naltiradi

### Middleware yaratish: `my-app/src/middleware.ts`
```typescript
// Route himoyasi:
// /dashboard/* — faqat store_admin va super_admin
// /store/* — faqat cashier
// /super-admin/* — faqat super_admin
// /login — faqat login qilmaganlar
```

### Tekshirish:
- Ro'yxatdan o'tish ishlashi kerak
- Login ishlashi kerak (email + password)
- Noto'g'ri rol bilan kirsa — qaytarishi kerak
- Session cookie saqlanishi kerak

---

# ═══════════════════════════════════════════
# 🟢 FAZA 2: SUPER ADMIN PANEL
# ═══════════════════════════════════════════

## ✅ Bosqich 2.1: Super Admin layout va sahifalar (Bajarildi)

### Vazifa:
`/super-admin` yo'lida yangi layout yaratish. Faqat `super_admin` roli kirishi mumkin.

### Yaratish kerak bo'lgan fayllar:

```
my-app/src/app/super-admin/
├── layout.tsx              # Super admin layout (sidebar + header)
├── page.tsx                # Bosh panel (umumiy statistika)
├── organizations/
│   └── page.tsx            # Barcha do'konlar ro'yxati
├── subscriptions/
│   └── page.tsx            # Obunalar boshqaruvi
├── analytics/
│   └── page.tsx            # Umumiy analitika
└── settings/
    └── page.tsx            # Tizim sozlamalari
```

### Super Admin sidebar elementlari:
1. **Bosh panel** — umumiy KPI: jami do'konlar, faol, bloklangan, oylik daromad
2. **Tashkilotlar** — barcha do'konlar ro'yxati, qidirish, filtr (faol/bloklangan/trial)
3. **Obunalar** — kim to'lagan, kim to'lamagan, muddati tugayotganlar
4. **Analitika** — grafiklar: oylik yangi do'konlar, daromad o'sishi
5. **Sozlamalar** — tarif narxlari, tizim konfiguratsiyasi

### Super Admin login:
**Fayl yaratish**: `my-app/src/app/login/super/page.tsx`
- Maxsus login sahifa: `hoyr.uz/login/super`
- Faqat `super_admin` roli kirishi mumkin
- Qizil rang sxemasi (admin — oltin, kassir — ko'k, super — qizil)

### Bosh panel KPI kartalar:
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Jami do'konlar│ │ Faol do'konlar│ │ Oylik daromad │ │ Yangi (bu oy) │
│     156      │ │     142      │ │  42 mln so'm │ │      8       │
│    +12%      │ │     91%      │ │    +18%      │ │    +33%      │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Tashkilotlar sahifasi jadval ustunlari:
| Do'kon nomi | Egasi | Tarif | Holat | Filiallar | Kassirlar | Obuna muddati | Amallar |
|-------------|-------|-------|-------|-----------|-----------|---------------|---------|
| Baraka | Sardor | Business | Faol | 3 | 5 | 2026-03-15 | [Bloklash] [Tahrirlash] |

### Tekshirish:
- `/super-admin` — faqat super_admin kirishi kerak
- Boshqa rollar kirganda → o'z login sahifasiga qaytarilishi kerak
- Barcha tashkilotlar ko'rinishi kerak
- Bloklash tugmasi ishlashi kerak

---

## ✅ Bosqich 2.2: Tashkilot boshqaruvi (Bajarildi)

### Vazifa:
Super Admin yangi tashkilot qo'shishi, tahrirlashi, bloklashi mumkin.

### Funksiyalar:
1. **Yangi tashkilot qo'shish** — modal oyna: nom, slug, egasi email, tarif
2. **Tahrirlash** — tarif o'zgartirish, ma'lumotlarni yangilash
3. **Bloklash/Faollashtirish** — toggle tugma
4. **O'chirish** — tasdiqlash bilan (barcha ma'lumotlar o'chadi)
5. **Obuna muddatini uzaytirish** — qo'lda muddatni o'zgartirish

### API route yaratish:
**Fayl**: `my-app/src/app/api/admin/organizations/route.ts`
- `GET` — barcha tashkilotlar (pagination bilan)
- `POST` — yangi tashkilot yaratish
- `PATCH` — tahrirlash
- `DELETE` — o'chirish

### Tekshirish:
- Yangi tashkilot yaratilganda database da paydo bo'lishi kerak
- Bloklangan tashkilot a'zolari login qilolmasligi kerak

---

# ═══════════════════════════════════════════
# 🟡 FAZA 3: DO'KON ADMIN PANELNI DATABASE GA ULASH
# ═══════════════════════════════════════════

## ✅ Bosqich 3.1: Admin Dashboard ni real dataga o'tkazish (Bajarildi)

### Vazifa:
Hozirgi `/dashboard` sahifadagi mock (soxta) ma'lumotlarni Supabase dan olinadigan real ma'lumotlarga almashtirish.

### O'zgartirish kerak bo'lgan fayllar:

1. **`src/lib/data.ts`** — Mock data ni API funksiyalarga almashtirish:
```typescript
// Eski: export const stores = [{...}]
// Yangi: 
export async function getStores(orgId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('stores')
    .select('*')
    .eq('organization_id', orgId)
  return data
}
```

2. **`/dashboard/page.tsx`** — KPI kartalarni real ma'lumotlardan hisoblash
3. **`/stores/page.tsx`** → **`/dashboard/stores/page.tsx`** — real filiallar
4. **`/products/page.tsx`** → **`/dashboard/products/page.tsx`** — real mahsulotlar
5. **`/orders/page.tsx`** → **`/dashboard/orders/page.tsx`** — real buyurtmalar
6. **`/customers/page.tsx`** → **`/dashboard/customers/page.tsx`** — real mijozlar

### Muhim: Route tuzilmasini o'zgartirish
Hozir sahifalar `/stores`, `/products` da. **Barchasini `/dashboard/...` ichiga ko'chirish kerak**:

```
my-app/src/app/dashboard/
├── page.tsx                # Bosh panel (KPI + grafik)
├── stores/
│   └── page.tsx            # Filiallar
├── products/
│   └── page.tsx            # Mahsulotlar
├── orders/
│   └── page.tsx            # Buyurtmalar
├── customers/
│   └── page.tsx            # Mijozlar
├── inventory/
│   └── page.tsx            # Ombor (yoki Mahsulotlar bilan birlashtirish)
├── staff/
│   └── page.tsx            # YANGI: Xodimlar (kassirlar) boshqaruvi
└── analytics/
    └── page.tsx            # YANGI: Chuqur analitika
```

### Tekshirish:
- Dashboard da real ma'lumotlar ko'rinishi kerak
- Yangi mahsulot qo'shilganda database ga saqlashi kerak
- Sahifani yangilaganda ma'lumotlar saqlanib qolishi kerak

---

## ✅ Bosqich 3.2: Xodimlar (kassirlar) boshqaruvi (Bajarildi)

### Vazifa:
Admin panelda yangi sahifa: do'kon egasi o'z kassirlarini qo'shishi va boshqarishi.

### Fayl yaratish: `my-app/src/app/dashboard/staff/page.tsx`

### Funksiyalar:
1. **Kassirlar ro'yxati** — ism, email, filial, holat (faol/bloklangan)
2. **Yangi kassir qo'shish** — modal: ism, email, parol, qaysi filialga biriktirish
3. **Kassirni bloklash** — ishlashiga yo'l qo'ymaslik
4. **Kassirni o'chirish** — faqat tasdiqlash bilan

### API:
```typescript
// Yangi kassir yaratish
const { data } = await supabaseAdmin.auth.admin.createUser({
  email: 'kassir@email.com',
  password: 'parol123',
  user_metadata: { 
    full_name: 'Anvar Toshmatov',
    role: 'cashier'
  }
})
// Profilga organization_id va store_id qo'shish
await supabase.from('profiles').update({
  organization_id: currentOrgId,
  store_id: selectedStoreId
}).eq('id', data.user.id)
```

### Tekshirish:
- Yangi kassir yaratilganda u login qilolishi kerak
- Kassir faqat o'zi biriktrilgan filialni ko'rishi kerak

---

## ✅ Bosqich 3.3: Analitika sahifasi (Bajarildi)

### Vazifa:
Admin panelga chuqur analitika sahifasi qo'shish.

### Fayl: `my-app/src/app/dashboard/analytics/page.tsx`

### Ko'rsatiladigan grafiklar:
1. **Oylik sotuv grafigi** — so'nggi 12 oy, bar chart
2. **Top 10 mahsulot** — eng ko'p sotilganlar, horizontal bar
3. **Filiallar solishtirmasi** — har bir filialning daromadi, pie chart
4. **Sotuv kanallari** — naqd vs karta, donut chart
5. **Mijozlar o'sishi** — yangi mijozlar grafigi, line chart

### Grafik kutubxonasi:
```bash
npm install recharts
```

### Tekshirish:
- Grafiklar database dan real ma'lumotlarni ko'rsatishi kerak
- Filtrlash ishlashi kerak (sana bo'yicha, filial bo'yicha)

---

# ═══════════════════════════════════════════
# 🔴 FAZA 4: KASSIR PANELNI DATABASE GA ULASH
# ═══════════════════════════════════════════

## ✅ Bosqich 4.1: Kassir vitrinasini real ma'lumotlarga o'tkazish (Bajarildi)

### Vazifa:
`/store` sahifasidagi mock mahsulotlarni database dan olinadigan real mahsulotlarga almashtirish.

### O'zgartirish:
1. **`src/lib/store-data.ts`** — Mock data ni API funksiyalarga almashtirish
2. **`src/lib/product-context.tsx`** — Supabase dan mahsulotlarni olish
3. **`/store/page.tsx`** — Real mahsulotlarni ko'rsatish
4. **`/store/products/page.tsx`** — Real mahsulotlar boshqaruvi

### Kassir faqat o'z filialining mahsulotlarini ko'radi:
```typescript
const { data: products } = await supabase
  .from('products')
  .select('*, inventory!inner(quantity)')
  .eq('organization_id', profile.organization_id)
  .eq('inventory.store_id', profile.store_id)
  .eq('is_active', true)
```

### Tekshirish:
- Kassir faqat o'z filialining mahsulotlarini ko'rishi kerak
- Boshqa filialning mahsulotlari ko'rinmasligi kerak

---

## ✅ Bosqich 4.2: Savat va to'lov tizimini database ga ulash (Bajarildi)

### Vazifa:
Kassir savat orqali to'lov qilganda — buyurtma database ga saqlanishi kerak.

### O'zgartirish: `src/components/store/cart-modal.tsx`

### To'lov jarayoni:
```
1. Kassir mahsulotlarni savatga soladi
2. "To'lov qilish" bosadi
3. To'lov usulini tanlaydi (naqd/karta)
4. Tizim avtomatik:
   a. `orders` jadvaliga yangi buyurtma qo'shadi
   b. `order_items` jadvaliga barcha mahsulotlarni qo'shadi
   c. `inventory` jadvalida qoldiqni kamaytiradi (trigger orqali)
   d. `customers` jadvalida jami xaridni oshiradi
5. Muvaffaqiyat xabari ko'rsatiladi
6. Printerga chek yuborish (kelajakda)
```

### API: `my-app/src/app/api/orders/route.ts`
```typescript
export async function POST(req: Request) {
  const { items, paymentMethod, customerId, storeId } = await req.json()
  
  // 1. Buyurtma yaratish
  const { data: order } = await supabase.from('orders').insert({
    organization_id: orgId,
    store_id: storeId,
    cashier_id: userId,
    customer_id: customerId,
    order_number: generateOrderNumber(),
    payment_method: paymentMethod,
    subtotal: calculateSubtotal(items),
    total: calculateTotal(items),
    status: 'delivered' // kassir to'lovda — darhol yetkazildi
  }).select().single()

  // 2. Buyurtma tarkibini saqlash
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
    size: item.size,
    color: item.color
  }))
  await supabase.from('order_items').insert(orderItems)
  // inventory trigger avtomatik qoldiqni kamaytiradi
}
```

### Tekshirish:
- To'lovdan keyin `orders` jadvalida yangi buyurtma paydo bo'lishi kerak
- Ombor qoldig'i avtomatik kamayishi kerak
- Admin panelda buyurtma ko'rinishi kerak

---

# ═══════════════════════════════════════════
# 🟣 FAZA 5: RO'YXATDAN O'TISH VA OBUNA
# ═══════════════════════════════════════════

## ✅ Bosqich 5.1: Ro'yxatdan o'tish sahifasi (Bajarildi)

### Vazifa:
Yangi do'kon egasi ro'yxatdan o'tadigan sahifa yaratish.

### Fayl yaratish: `my-app/src/app/register/page.tsx`

### Forma maydonlari:
1. **Do'kon nomi** — "Baraka"
2. **Egasining ismi** — "Sardor Karimov"
3. **Telefon** — "+998 90 123 45 67"
4. **Email** — "sardor@mail.com"
5. **Parol** — "********"
6. **Tarif tanlash** — Starter / Business / Premium (kartalar bilan)

### Jarayon:
```
1. Forma to'ldiriladi
2. Supabase Auth da yangi user yaratiladi (role: store_admin)
3. organizations jadvalida yangi tashkilot yaratiladi 
4. profiles jadvalida organization_id qo'shiladi
5. 14 kunlik bepul sinov boshlaydi (trial)
6. /dashboard ga yo'naltiriladi
```

### Tekshirish:
- Yangi foydalanuvchi ro'yxatdan o'tganda login qilolishi kerak
- Trial muddati 14 kun bo'lishi kerak
- Super Admin da yangi tashkilot ko'rinishi kerak

---

## Bosqich 5.2: Obuna to'lov tizimi

### Vazifa:
Payme/Click orqali oylik obuna to'lov.

### Hozircha placeholder:
Haqiqiy Payme/Click integratsiyasi murakkab va merchant hisob kerak.
Hozircha "To'lov qilish" tugmasi + Super Admin qo'lda faollashtirish.

### Kelajakda integratsiya:
```
Payme API → Webhook → subscription_status = 'active'
Click API → Webhook → subscription_ends_at = NOW() + 30 days
```

### Obuna holati tekshirish middleware:
```typescript
// Har bir /dashboard va /store sahifada tekshirish:
if (org.subscription_status === 'expired' || org.subscription_status === 'blocked') {
  redirect('/subscription-expired') // "Obunangiz tugadi" sahifasi
}
```

---

# ═══════════════════════════════════════════
# 🟤 FAZA 6: QO'SHIMCHA FUNKSIYALAR
# ═══════════════════════════════════════════

## ✅ Bosqich 6.1: Telegram bot integratsiya (Bajarildi)

### Vazifa:
Har bir sotuv haqida do'kon egasiga Telegram xabar yuborish.

### Sozlamalar sahifasida:
- Do'kon egasi Telegram bot token va chat_id ni kiritadi
- Har bir to'lovda webhook orqali xabar yuboriladi

### Xabar formati:
```
🛒 YANGI SOTUV!
📍 Filial: Baraka Chilonzor
👤 Kassir: Anvar
💰 Summa: 509,000 so'm
🧾 Buyurtma: B-1042
📦 Mahsulotlar: Erkaklar ko'ylagi (2), Jins shim (1)
💳 To'lov: Naqd pul
```

---

## Bosqich 6.2: PDF Hisobot

### Vazifa:
Admin paneldan PDF formatda sotuv hisoboti yuklab olish.

### Kutubxona:
```bash
npm install @react-pdf/renderer
```

### Hisobot turlari:
1. **Kunlik hisobot** — bugungi barcha sotuvlar
2. **Oylik hisobot** — oylik statistika
3. **Filial hisoboti** — bitta filial bo'yicha

---

## ✅ Bosqich 6.3: Shtrix-kod skaneri (Bajarildi)

### Vazifa:
Kassir panelda kameradan shtrix-kod skanerlash.

### Kutubxona:
```bash
npm install @zxing/library react-qr-barcode-scanner
```

### Ishlash tartibi:
1. Kassir "Skanerlash" tugmasini bosadi
2. Kamera ochiladi
3. Shtrix-kod skanerlaydi
4. Mahsulot avtomatik savatga qo'shiladi

---

# ═══════════════════════════════════════════
# 📅 VAQT REJASI (Taxminiy)
# ═══════════════════════════════════════════

| Faza | Tavsif | Taxminiy vaqt |
|------|--------|---------------|
| **Faza 1** | Database + Auth | 2-3 kun |
| **Faza 2** | Super Admin panel | 2 kun |
| **Faza 3** | Admin panelni DB ga ulash | 3 kun |
| **Faza 4** | Kassir panelni DB ga ulash | 2 kun |
| **Faza 5** | Ro'yxatdan o'tish + Obuna | 2 kun |
| **Faza 6** | Telegram, PDF, Skaner | 3 kun |
| **JAMI** | | **~15 ish kuni** |

---

# ✅ TAYYOR BO'LGANDAN KEYIN

1. Supabase production loyiha yaratish
2. Vercel da environment variables sozlash
3. Custom domain ulash: `hoyr.uz`
4. SSL sertifikat (Vercel avtomatik)
5. Birinchi test do'kon qo'shish
6. 5 ta do'konga bepul sinov berish (feedback olish)
7. Marketingni boshlash (Telegram, Instagram)

---

> **Bu reja agentga aniq ko'rsatma sifatida ishlaydi.**
> Har bir bosqichda: nima yaratish, qaysi fayllar, qanday tekshirish — barchasi yozilgan.
> Agent shu rejaga qarab bosqichma-bosqich ishlaydi. ✅
