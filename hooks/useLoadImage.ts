import { Song } from '@/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/types_db';

const useLoadImage = (song: Song) => {
  const supabaseClient = useSupabaseClient<Database>();

  if (!song) {
    return null;
  }

  const { data: imageData } = supabaseClient
    .storage
    .from('images')
    .getPublicUrl(song.image_path);

  return imageData.publicUrl;
};

export default useLoadImage;
