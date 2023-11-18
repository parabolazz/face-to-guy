<template>
  <CardList
    class="sys-question-cards"
    ref="cardListRef"
    :showCustomCard="false"
    :getValidCardLength="getValidCardLength"
    :getActivityList="getActivityList"
  >
    <template #item="{ data }">
      <QuestionCard v-bind="data" :userId="userId">
        <template v-slot:extra>
          <div class="flex justify-between mb-6 transparent-desc-text">
            是否将该答案分享至公共频道:
            <nut-switch v-model="isShare" />
          </div>
        </template>
        <template v-slot:btn="slotProps">
          <nut-button
            class="question-card__submit"
            type="primary"
            :disabled="!slotProps.answer"
            open-type="share"
            @click="onAnswer(data, slotProps.answer)"
            >提交并分享到群聊</nut-button
          >
        </template>
      </QuestionCard>
    </template>
  </CardList>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { getSystemQuestons } from '../../api/matching';
import CardList from '../../components/cardList/index.vue';
import QuestionCard, {
  type QuestionCardProps,
} from '../../components/questionCard/index.vue';
defineProps<{
  userId: number;
}>();

const emit = defineEmits<{
  (
    e: 'onAnswer',
    data: {
      answer: string;
      title: string;
      type: 1 | 2;
      user_id: number;
    },
  ): void;
}>();
const getValidCardLength = () => true;
const isShare = ref(false);
const getActivityList = ({ page_num, user_id }) =>
  getSystemQuestons({
    user_id,
    page_num,
    page_size: 20,
  }).then((res) => {
    return {
      data: {
        question: res.data.list,
      },
    };
  });

const onAnswer = (info: QuestionCardProps, answer: string) => {
  emit('onAnswer', {
    answer,
    title: info.title,
    type: info.type,
    user_id: info.userId,
  });
};
</script>
<style lang="scss">
.sys-question-cards {
  height: 100%;
  .matching-swiper .matching-swiper__card-content {
    background-color: #67a4ff;
  }
  .question-card {
    background-color: #67a4ff;
    .question-card__tag {
      background-color: #4d94ff;
    }
  }
}
</style>
