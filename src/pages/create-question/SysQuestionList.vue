<template>
  <nut-config-provider class="sys-question-card" theme="light">
    <QuestionCard v-bind="info">
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
          @click="onAnswer(slotProps.info)"
          >提交并分享到群聊</nut-button
        >
      </template>
    </QuestionCard>
  </nut-config-provider>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { getSystemQuestons } from '../../api/matching';
import QuestionCard, {
  type QuestionCardProps,
} from '../../components/questionCard/index.vue';
const props = defineProps<{
  userId: number;
}>();

const isShare = ref(false);

const info = ref<QuestionCardProps>({
  type: 1,
  title: 'hello',
  userId: 0,
  id: 0,
});

getSystemQuestons({
  user_id: props.userId,
  page_num: 1,
  page_size: 20,
}).then((res) => {
  info.value = {
    ...res.data,
    userId: props.userId,
  };
});

const onAnswer = (info: QuestionCardProps) => {
  console.log('info', info);
};
</script>
<style lang="scss">
.sys-question-card {
  height: 100%;
  .question-card {
    background-color: #67a4ff;
    .question-card__tag {
      background-color: #4d94ff;
    }
  }
}
</style>
