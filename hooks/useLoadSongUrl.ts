import { Song } from '@/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/types_db';

const useLoadSongUrl = (song?: Song) => {
  const supabaseClient = useSupabaseClient<Database>();

  if (!song?.song_path) {
    return '';
  }

  const { data: songData} = supabaseClient
    .storage
    .from('songs')
    .getPublicUrl(song.song_path);

  return songData.publicUrl
}

export default useLoadSongUrl;
