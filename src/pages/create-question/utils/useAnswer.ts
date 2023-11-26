import { computed } from "vue";
import { createQuesForMyGroupChat } from "../../../api/matching";
import sha256 from 'crypto-js/sha256';
import Taro, { useShareAppMessage } from "@tarojs/taro";

export default function useAnswer(question, userId) {
  const shareId = computed(() => sha256(question.value + userId + 'confession_share').toString())

  useShareAppMessage(() => {
    return {
      title: question.value,
      path: `/pages/share-ques-detail/index?shareId=${shareId.value}`,
    };
  });

  const onCreateQuestion = async ({
    answer,
    question,
    type,
    userId,
    activity_id,
    originalShareId,
  }: {
    answer: string,
    question: string,
    type: 1 | 2,
    userId: number
    activity_id?: number
    originalShareId?: string
  }) => {
    await createQuesForMyGroupChat({
      answer: answer,
      title: question,
      user_id: userId,
      type: type,
      share_id: originalShareId || shareId.value,
      activity_id: activity_id,
    });
    return shareId.value
  }
  return {
    onCreateQuestion
  }
}

