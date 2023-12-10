import { computed } from "vue";
import { createQuesForMyGroupChat } from "../../../api/matching";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import Base64 from "../../../utils/base64";

export default function useAnswer(question, userId) {
  //sharedId = user_id + "_" + base64(问题tilte) + "_" + 秒级时间戳。
  const shareId = computed(() => {
    const timestamp = new Date().getTime();
    const base64Question = Base64.encode(question.value);
    return `${userId.value || ''}_${base64Question}_${timestamp}`;
  })

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

