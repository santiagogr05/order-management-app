// src/pages/api/categories.ts
import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('categoryid, categoryname')
    .order('categoryname');

  if (error) {
    console.error('Error fetching categories:', error);
    return new Response(JSON.stringify({
      message: 'Failed to fetch categories.',
      error: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
