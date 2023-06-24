<template>
  <nut-config-provider theme="light">
    <div class="question-card">
      <span class="question-card__head">问题卡</span>
      <div class="question-card__desc">
        回答问题后开始在圈子里有曝光，积极完成问题，就会有更多人看到你！
      </div>
      <div class="question-card__main">
        <div class="question-card__main-text">用一种动物来形容你自己？</div>
        <div class="question-card__main-answer-filed">
          <nut-input
            class="question-card__input"
            v-if="type === 'text'"
            input-align="left"
            :border="false"
            v-model="answer"
            placeholder="回答问题，交换答案"
            type="textarea"
          />
          <nut-uploader
            v-else
            class="question-card__uploader"
            :sizeType="['compressed']"
            :mediaType="['image']"
            url="https://110.41.140.132/pairs/uploadImg"
            :headers="{
              Authorization: authToken,
            }"
            @success="onUploadSuccess"
            v-model:file-list="image"
            :is-preview="true"
          />
        </div>
      </div>
      <div class="question-card__footer">
        <nut-button
          class="question-card__submit"
          type="primary"
          @click="onAnswer"
          >完成编辑</nut-button
        >
      </div>
    </div>
  </nut-config-provider>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { ref } from 'vue';

const authToken = ref(Taro.getStorageSync('TOKEN'));
const image = ref([]);
const onAnswer = () => {
  console.log('!');
};
const onUploadSuccess = () => {};
const props = defineProps<{
  type: 'text' | 'image';
  title: string;
}>();
const answer = ref('');
</script>
<style lang="scss">
.question-card {
  width: 100%;
  background: #6967ff;
  border-radius: 9px;
  padding: 12px 12px 36px;
  .question-card__head {
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
  }
  .question-card__uploader {
    margin-top: 22px;
    margin-bottom: 36px;
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
}
</style>
