import { Song } from '@/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types_db';

const getSongsByUserId = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient<Database>({
    cookies
  });

  const {
    data: sessionData,
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError || !sessionData.session?.user) {
    console.log(sessionError?.message || 'No user found');
    return [];
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('user_id', sessionData.session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error.message);
    return [];
  }

  return data;
};

export default getSongsByUserId;
