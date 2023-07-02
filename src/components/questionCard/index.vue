<template>
  <nut-config-provider theme="">
    <div class="question-card">
      <div class="question-card__header">
        <span class="question-card__tag">问题卡</span>
        <div class="question-card__desc">
          回答问题后开始在圈子里有曝光，积极完成问题，就会有更多人看到你！
        </div>
      </div>
      <div class="question-card__main">
        <div class="question-card__main-text">{{ title }}</div>
        <div class="question-card__main-answer-filed">
          <nut-input
            class="question-card__input"
            v-if="type === 1"
            input-align="left"
            :border="false"
            v-model="answer"
            placeholder="回答问题，交换答案"
            type="textarea"
          />
          <template v-else>
            <nut-uploader
              v-if="!images.length"
              class="question-card__uploader"
              :sizeType="['compressed']"
              :mediaType="['image']"
              url="https://110.41.140.132/pairs/uploadImg"
              :headers="{
                Authorization: authToken,
              }"
              v-model:file-list="images"
              :is-preview="true"
            />
            <img
              class="question-card__uploader"
              v-else
              :src="images[0].url"
              alt="answer image"
            />
          </template>
        </div>
        <nut-button
          class="question-card__submit"
          type="primary"
          @click="onAnswer"
          >{{ answer ? '完成编辑' : '请进行编辑' }}</nut-button
        >
      </div>
    </div>
  </nut-config-provider>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { ref, watch } from 'vue';
import { answerQuestionActivity } from '../../api/matching';

defineProps<{
  type: 1 | 2;
  title: string;
}>();
const instance = Taro.getCurrentInstance();

const emit = defineEmits(['onAnswer']);
const authToken = ref(Taro.getStorageSync('TOKEN'));
const images = ref<
  {
    url: string;
  }[]
>([]);
const answer = ref('');
const onAnswer = async () => {
  try {
    await answerQuestionActivity({
      activity_id: Number(instance.router?.params.activityId!),
      answer: answer.value,
    });
    Taro.showToast({
      title: '回答成功！',
      icon: 'success',
    });
    setTimeout(() => {
      emit('onAnswer');
    }, 500);
  } catch (error) {
    Taro.showToast({
      title: '系统出错，请稍后再试！',
      icon: 'error',
    });
  }
};
watch(
  () => images.value.length,
  (v) => {
    if (v) {
      Taro.showToast({
        title: '上传成功',
        icon: 'success',
      });
      answer.value = images.value[0].url;
    }
  },
);
</script>
<style lang="scss">
.question-card {
  height: 565px;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #6967ff;
  border-radius: 9px;
  padding: 12px 12px 36px;
  .question-card__header {
    flex-shrink: 0;
  }
  .question-card__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .question-card__tag {
    display: inline-block;
    padding: 7px 12px;
    border-radius: 30px;
    background-color: #000;
    color: #fff;
    font-size: 14px;
    margin-bottom: 12px;
  }
  .question-card__desc {
    color: #eee;
    font-size: 12px;
    padding-bottom: 22px;
    border-bottom: 0.5px solid #eee;
  }
  .question-card__main-text {
    margin-top: 36px;
    font-size: 24px;
    color: #fff;
    font-weight: 500;
  }
  .question-card__submit {
    color: #000;
    width: 100%;
    height: 56px;
    border-radius: 9px;
    font-size: 18px;
    font-weight: 500;
  }
  .question-card__input {
    height: 195px;
    border-radius: 9px;
    margin: 54px 0 36px;
    padding: 10px;
    color: #000;
  }
  .nut-uploader__upload {
    width: 195px;
    height: 195px;
    background-color: transparent;
    border: 1px dashed #eee;
    border-radius: 9px;
    .nutui-iconfont.nut-icon.nut-icon-photograph {
      color: #dad9d9 !important;
      width: 40px;
      height: 40px;
      font-size: 30px;
    }
  }
  .question-card__uploader {
    width: 195px;
    height: 195px;
    border: 1px dashed #eee;
    border-radius: 9px;
  }
}
</style>
