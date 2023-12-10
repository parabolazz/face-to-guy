<template>
  <div class="custom-question-card">
    <div class="custom-question-card__header">
      <span class="custom-question-card__tag">提问卡</span>
      <div class="custom-question-card__desc">
        回答问题后开始在圈子里有曝光，积极完成问题，就会有更多人看到你！
      </div>
    </div>
    <div class="custom-question-card__main">
      <div class="custom-question-card__main-text">
        你有什么想要问圈友的吗？
      </div>
      <div class="custom-question-card__main-answer-field">
        <nut-textarea
          class="custom-question-card__input"
          input-align="left"
          :border="false"
          v-model="answer"
          placeholder="问题通过审核之后将会给所有圈友看到"
          placeholder-class="custom-question-card__placeholder"
        />
        <div class="flex items-center">
          请选择卡片类型：
          <nut-radio-group v-model="quesType" direction="horizontal">
            <nut-radio :label="1">文字卡</nut-radio>
            <nut-radio :label="2">图片卡</nut-radio>
          </nut-radio-group>
        </div>
      </div>
      <nut-button
        class="custom-question-card__submit"
        type="primary"
        :disabled="!answer"
        @click="onAnswer"
        >提交</nut-button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { ref } from 'vue';
import { uploadMyIssue } from '../../api/matching';
const props = defineProps<{
  userId: number;
}>();
const instance = Taro.getCurrentInstance();
const quesType = ref(1);
const emit = defineEmits(['onAnswer']);
const answer = ref('');
const onAnswer = async () => {
  try {
    await uploadMyIssue({
      a_id: Number(instance.router?.params.activityId!),
      title: answer.value,
      user_id: props.userId,
      type: quesType.value,
    });
    Taro.showToast({
      title: '提交成功！',
      icon: 'success',
    });
    setTimeout(() => {
      emit('onAnswer');
    }, 500);
  } catch (error) {}
};
</script>
<style lang="scss">
.custom-question-card {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #67a4ff;
  border-radius: 9px;
  padding: 12px 12px 36px;

  .custom-question-card__header {
    flex-shrink: 0;
  }
  .custom-question-card__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .custom-question-card__tag {
    display: inline-block;
    padding: 7px 12px;
    border-radius: 30px;
    background-color: #4d94ff;
    color: #fff;
    font-size: 14px;
    margin-bottom: 12px;
  }
  .custom-question-card__desc {
    color: #fff;
    font-size: 14px;
    padding-bottom: 22px;
    border-bottom: 0.5px solid #eee;
    opacity: 0.5;
  }
  .custom-question-card__placeholder {
    color: #bbbbbb;
    font-size: 16px;
  }
  .custom-question-card__main-text {
    margin-top: 30px;
    font-size: 24px;
    color: #fff;
    font-weight: bold;
  }
  .custom-question-card__submit {
    color: #000;
    width: 100%;
    height: 50px;
    border-radius: 9px;
    font-size: 18px;
    font-weight: bold;
  }
  .custom-question-card__main-answer-field {
    display: flex;
    flex-direction: column;
    margin: 12px 0 12px;
    border-radius: 9px;
  }
  .custom-question-card__item {
    margin-bottom: 24px;
  }
  .custom-question-card__input {
    max-height: 100%;
    height: 200px;
    padding: 13px;
    color: #000;
    overflow: hidden;
    font-size: 24px !important;
  }
  .nut-textarea {
    padding: 0;
    height: 200px;
    height: 100%;
    overflow: hidden;
    border-radius: 9px;
    margin-bottom: 24px;
  }
  .nut-radio-group {
    height: 20px;
  }
  .nut-radio {
    margin-bottom: 0px;
  }
  .nut-radio__label {
    color: #fff;
  }
}
</style>
