<template>
  <nut-config-provider theme="dark" class="full-height create-question">
    <nut-tabs v-model="currentTab">
      <nut-tab-pane title="系统问题库">
        <SysQuestionList :userId="userId" @onAnswer="onAnswer" />
      </nut-tab-pane>
      <nut-tab-pane title="自定义问题">
        <div class="create-question__custom">
          <CreateQuestionCard :userId="userId" @onAnswer="onAnswer" />
        </div>
      </nut-tab-pane>
    </nut-tabs>
    <div class="chats-placeholder"></div>
  </nut-config-provider>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import CreateQuestionCard from '../../components/createQuestionCard/index.vue';
import SysQuestionList from './SysQuestionList.vue';
import useAnswer from './utils/useAnswer';
import Taro, { useShareAppMessage } from '@tarojs/taro';

useShareAppMessage(() => {
  return {
    title: question.value,
    path: '/pages/home/index',
  };
});

const currentTab = ref('0');
const userId = Taro.getStorageSync('USER_ID');
const { onCreateQuestion } = useAnswer();
const question = ref('');

const onAnswer = ({
  answer,
  title,
  type,
}: {
  answer: string;
  title: string;
  type: 1 | 2;
}) => {
  question.value = title;
  onCreateQuestion({
    answer,
    question: title,
    type,
    userId,
  });
};
</script>
<style lang="scss">
.create-question {
  display: flex;
  flex-direction: column;
  .nut-tabs,
  .nut-tabs__content {
    flex-grow: 1;
  }
  .create-question__custom {
    height: 100%;
  }
}
</style>
