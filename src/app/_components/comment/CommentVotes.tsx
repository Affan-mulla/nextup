import { Button } from '@/components/ui/button'
import { ArrowBigDownDash, ArrowBigUpDash } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'

interface CommentVotesProps {
    votesCount: number
    userVote: "UP" | "DOWN" | undefined | null
    handleVote: (voteType: "UP" | "DOWN") => void
    isVoting: boolean
    initialVotesCount: number
    localIsDeleted: boolean
}

const CommentVotes = ({votesCount, userVote, handleVote, isVoting, initialVotesCount, localIsDeleted}: CommentVotesProps) => {
  return (
    <div className="flex gap-2 items-center">
              <Button
                variant={"ghost"}
                size={"icon-sm"}
                className={`transition-colors duration-150 ${
                  userVote === "UP"
                    ? "text-green-500"
                    : "hover:text-green-500"
                }`}
                onClick={() => handleVote("UP")}
                disabled={isVoting || localIsDeleted}
              >
                <ArrowBigUpDash className="size-4"  />
              </Button>
              <motion.span
                key={votesCount}
                initial={{ scale: 1 }}
                animate={votesCount !== initialVotesCount ? { scale: [1, 1.2, 1] } : {}}
                className={`text-xs font-medium ${
                  votesCount > 0
                    ? "text-green-500"
                    : votesCount < 0
                    ? "text-red-500"
                    : ""
                }`}
              >
                {votesCount}
              </motion.span>
              <Button
                variant={"ghost"}
                size={"icon-sm"}
                className={`transition-colors duration-150 ${
                  userVote === "DOWN"
                    ? "text-red-500"
                    : "hover:text-red-500"
                }`}
                onClick={() => handleVote("DOWN")}
                disabled={isVoting || localIsDeleted}
              >
                <ArrowBigDownDash className="size-4" />
              </Button>
            </div>
  )
}

export default CommentVotes