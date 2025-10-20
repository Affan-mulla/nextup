import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export function useDeleteComment() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteComment = async (commentId: string, userId: string) => {
    if (isDeleting) return null;

    try {
      setIsDeleting(true);
      const response = await axios.post('/api/comment/delete', {
        commentId,
        userId,
      });

      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
      return null;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteComment,
    isDeleting,
  };
}