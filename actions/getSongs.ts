import { Song } from '@/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types_db';

const getSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient<Database>({
    cookies
  });

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
  }

  if (data === null) {
    return [];
  }

  return data;
};

export default getSongs;
