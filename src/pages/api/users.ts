// src/pages/api/users.ts
import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      name,
      userpassword,
      userrole (
        rolename
      )
    `)
    .order('name');

  if (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({
      message: 'Failed to fetch users.',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  interface User {
    name: string;
    userpassword: string;
    userrole?: { rolename: string;  }[];
  }
  const users = data as User[];

  const result = data.map(user => ({
    name: user.name,
    userpassword: user.userpassword,
    rolename: user.userrole?.[0]?.rolename
  }));

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
