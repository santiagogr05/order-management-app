// src/pages/api/products.ts
import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      productid,
      productname,
      price,
      measureunits (
        measureunit
      ),
      categories (
        categoryname
      )
    `)
    .order('productname', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({
      message: 'Failed to fetch products.',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  interface Product {
  productid: number;
  productname: string;
  price: number;
  measureunits?: { measureunit: string; }[];
  categories?: { categoryname: string; }[];
}
const products = data as Product[];


  // Flatten related data if needed
  const result = products.map((p : Product) => ({
    productid: p.productid,
    productname: p.productname,
    price: p.price,
    measureunit: p.measureunits?.[0]?.measureunit,
    categoryname: p.categories?.[0]?.categoryname
  }));

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
