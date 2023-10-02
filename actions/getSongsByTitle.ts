import { Song } from '@/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types_db';
import getSongs from '@/actions/getSongs';

const getSongsByTitle = async (title: string): Promise<Song[]> => {
  const supabase = createServerComponentClient<Database>({
    cookies
  });

  if (!title) {
    return await getSongs();
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .ilike('title', `%${title}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
  }

  if (data === null) {
    return [];
  }

  return data;
};

export default getSongsByTitle;
