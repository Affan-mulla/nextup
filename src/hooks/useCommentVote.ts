import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useStore } from '@/store/store';

export function useCommentVote() {
  const [isVoting, setIsVoting] = useState(false);
  const { user } = useStore();

  const vote = async (commentId: string, type: 'UP' | 'DOWN') => {
    if (!user) {
      toast.error('Please sign in to vote');
      return null;
    }

    if (isVoting) return null;

    try {
      setIsVoting(true);
      const response = await axios.post('/api/comment/vote', {
        commentId,
        userId: user.id,
        type,
      });

      return response.data;
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote on comment');
      return null;
    } finally {
      setIsVoting(false);
    }
  };

  return {
    vote,
    isVoting,
  };
}