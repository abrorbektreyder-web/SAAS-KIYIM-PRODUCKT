import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local manually since this is a standalone script
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
    console.log('Checking for "products" bucket...');
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
        console.error('Error listing buckets:', listError);
        return;
    }

    const exists = buckets.find(b => b.name === 'products');
    
    if (!exists) {
        console.log('Creating "products" bucket...');
        const { data, error } = await supabaseAdmin.storage.createBucket('products', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
            fileSizeLimit: 2 * 1024 * 1024 // 2MB
        });
        
        if (error) {
            console.error('Error creating bucket:', error);
        } else {
            console.log('Bucket "products" created successfully:', data);
        }
    } else {
        console.log('Bucket "products" already exists.');
    }
}

setupStorage();
