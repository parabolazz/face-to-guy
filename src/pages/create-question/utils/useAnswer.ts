import { createQuesForMyGroupChat } from "../../../api/matching";
import sha256 from 'crypto-js/sha256';

export default function useAnswer() {
  const onCreateQuestion = ({
    answer,
    question,
    type,
    userId
  }: {
    answer: string,
    question: string,
    type: 1 | 2,
    userId: number
  }) => {
  const shareId = sha256(question + userId + 'confession_share').toString();
  return createQuesForMyGroupChat({
      answer: answer,
      title: question,
      user_id: userId,
      type: type,
      share_id: shareId
    });
  }
  return {
    onCreateQuestion
  }
}