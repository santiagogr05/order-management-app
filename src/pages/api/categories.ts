// This file will contain an Astro API route to fetch products from your Supabase PostgreSQL database.

import 'dotenv/config'; //imports the variables from the .env file
import { Client } from 'pg';
import type { APIRoute } from 'astro';


const DATABASE_URL = process.env.DATABASE_URL;


export const GET: APIRoute = async () => {
  // Basic validation: Check if the DATABASE_URL environment variable is set.
  if (!DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set.');
    return new Response(JSON.stringify({
      message: 'Database connection configuration missing. Please set DATABASE_URL environment variable.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Create a new PostgreSQL client instance using the connection string.
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false 
    }
  });

  try {
    
    await client.connect();

    const result = await client.query(
        'SELECT C.categoryid, C.categoryname FROM categories C ORDER BY categoryname;'
    );

    console.log(`Fetched ${result.rows.length} categories.`);

    // Return the fetched products as a JSON response.
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({
      message: 'Failed to fetch products.',
      error: error instanceof Error ? error.message : 'An unknown error occurred.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } finally {
    //realease the database connection
    await client.end();    
  }
};