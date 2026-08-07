import { createClient } from '@supabase/supabase-js';
import { CoffeeData, Theme } from '@/types/coffee';

interface UserRow {
  username: string;
  coffee_data?: CoffeeData;
  theme?: Theme;
  updated_at: string;
}

// Lazy initialization - only create client when needed
let supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not configured');
      return null;
    }
    
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

export async function checkUsernameExists(username: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  
  try {
    const { data, error } = await client
      .from('users')
      .select('username')
      .eq('username', username.toLowerCase())
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Supabase error:', error);
    return false;
  }
}

export async function getUserData(username: string): Promise<CoffeeData | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('users')
      .select('coffee_data')
      .eq('username', username.toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Supabase error:', error);
      return null;
    }

    return (data as { coffee_data: CoffeeData } | null)?.coffee_data || null;
  } catch (error) {
    console.error('Supabase error:', error);
    return null;
  }
}

export async function getUserTheme(username: string): Promise<Theme | null> {
  const client = getSupabase();
  if (!client) return null;
  
  try {
    const { data, error } = await client
      .from('users')
      .select('theme')
      .eq('username', username.toLowerCase())
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Supabase error:', error);
      return null;
    }
    
    return (data as { theme: Theme } | null)?.theme || null;
  } catch (error) {
    console.error('Supabase error:', error);
    return null;
  }
}

export async function saveUserData(username: string, data: CoffeeData): Promise<void> {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase not configured, skipping save');
    return;
  }

  try {
    const userData: UserRow = {
      username: username.toLowerCase(),
      coffee_data: data,
      updated_at: new Date().toISOString()
    };

    // The Supabase client has no generated Database schema, so `.from()` can't
    // infer the `users` table's row type - `as never` is the untyped-client
    // escape hatch, scoped to this call rather than the whole function.
    const { error } = await client
      .from('users')
      .upsert(userData as never, {
        onConflict: 'username'
      });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Supabase error:', error);
    throw error;
  }
}

export async function saveUserTheme(username: string, theme: Theme): Promise<void> {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase not configured, skipping save');
    return;
  }
  
  try {
    const userTheme: UserRow = {
      username: username.toLowerCase(),
      theme: theme,
      updated_at: new Date().toISOString()
    };

    const { error } = await client
      .from('users')
      .upsert(userTheme as never, {
        onConflict: 'username'
      });
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Supabase error:', error);
    throw error;
  }
}

export async function deleteUserData(username: string): Promise<void> {
  const client = getSupabase();
  if (!client) return;
  
  try {
    const { error } = await client
      .from('users')
      .delete()
      .eq('username', username.toLowerCase());
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Supabase error:', error);
    throw error;
  }
}
