'use client';

import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@supabase/auth-helpers-react';
import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import toast from 'react-hot-toast';

interface LikeButtonProps {
  songId: number;
}

const LikeButton: FC<LikeButtonProps> = ({ songId }) => {
  const [isLiked, setIsLiked] = useState(false);

  const router = useRouter();
  const { supabaseClient } = useSessionContext();

  const authModal = useAuthModal();
  const { user } = useUser();

  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
        const { error, data } = await supabaseClient
          .from('liked_songs')
          .select('*')
          .eq('user_id', user.id)
          .eq('song_id', songId)
          .single();

        if (!error && data) {
          setIsLiked(true);
        }
      };

      fetchData();
    }
  }, [songId, supabaseClient, user?.id]);

  const removeLike = async () => {
    const { error } = await supabaseClient
      .from('liked_songs')
      .delete()
      .eq('user_id', user!.id)
      .eq('song_id', songId);

    if (error) {
      toast.error(error.message);
      return;
    }

    setIsLiked(false);

    router.refresh();
  };

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      return removeLike();
    }

    const { error } = await supabaseClient
      .from('liked_songs')
      .insert({
        song_id: songId,
        user_id: user.id
      });

    if (error) {
      toast.error(error.message);
      return;
    }

    setIsLiked(true);
    toast.success('Liked!');
    router.refresh();
  };

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  return (
    <button
      onClick={handleLike}
      className={`
        hover:opacity-75
        transition
      `}
    >
      <Icon color={isLiked ? '#22c55e' : 'white'} />
    </button>
  );
};

export default LikeButton;
