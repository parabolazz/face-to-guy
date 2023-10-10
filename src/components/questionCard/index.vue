<template>
  <div class="question-card">
    <div class="question-card__header">
      <span class="question-card__tag">问题卡</span>
      <div class="question-card__desc">
        回答问题后开始在圈子里有曝光，积极完成问题，就会有更多人看到你！
      </div>
    </div>
    <div class="question-card__main">
      <div class="question-card__main-text">{{ title }}</div>
      <div class="question-card__main-answer-field">
        <nut-textarea
          class="question-card__input"
          v-if="type === 1"
          input-align="left"
          :border="false"
          v-model="answer"
          placeholder="回答问题，交换答案"
          placeholder-class="question-card__placeholder"
        />
        <div v-else>
          <Uploader
            ref="uploaderRef"
            v-show="!successImages.length"
            class="question-card__uploader"
            :sizeType="['compressed']"
            :mediaType="['image']"
            url="https://pairs.cc/pairs/uploadImg"
            :headers="{
              Authorization: authToken,
            }"
            v-model:file-list="images"
            :is-preview="false"
            mode="aspectFill"
            @failure="onUploadFailure"
            @delete="onDelete"
          />
          <img
            v-if="successImages.length"
            class="question-card__uploader"
            :src="images[0] ? images[0].url : ''"
            alt="answer image"
            mode="aspectFill"
            @click="replaceImage"
          />
        </div>
      </div>
      <nut-button
        class="question-card__submit"
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
import { ref, watch } from 'vue';
import { answerQuestionActivity } from '../../api/matching';
import Uploader from '../../components/uploader/index.vue';
import { computed } from 'vue';

const props = defineProps<{
  type: 1 | 2;
  title: string;
  userId: number;
  id: number;
}>();
const instance = Taro.getCurrentInstance();
const uploaderRef = ref();
const emit = defineEmits(['onAnswer']);
const authToken = ref(Taro.getStorageSync('TOKEN'));
const images = ref<
  {
    url: string;
    status: string;
  }[]
>([]);
const answer = ref('');
const successImages = computed(() =>
  images.value.filter((item) => item.status === 'success'),
);
const onDelete = () => {
  images.value = [];
};
const onAnswer = async () => {
  try {
    await answerQuestionActivity({
      a_id: Number(instance.router?.params.activityId!),
      answer: answer.value,
      user_id: props.userId,
      activity_id: props.id,
    });
    Taro.showToast({
      title: '回答成功！',
      icon: 'success',
    });
    setTimeout(() => {
      emit('onAnswer');
    }, 500);
  } catch (error) {}
};
const onUploadFailure = (data) => {
  const dataText = data?.data?.data || '';
  if (dataText.includes('451')) {
    Taro.showToast({
      title: '请上传合法图片！',
      icon: 'error',
      duration: 4000,
    });
  } else {
    Taro.showToast({
      title: '上传失败',
      icon: 'error',
    });
  }
};
const replaceImage = () => {
  uploaderRef.value.chooseImage();
};
watch(
  () => images.value,
  (v) => {
    if (v.length && v[0].status === 'success') {
      Taro.showToast({
        title: '上传成功',
        icon: 'success',
      });
      answer.value = v[0].url;
    }
  },
  { deep: true },
);
</script>
<style lang="scss">
.question-card {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #6967ff;
  border-radius: 9px;
  padding: 12px 12px 36px;

  .nut-uploader {
    padding: 13px 0 5px;
    &__upload {
      position: relative;
      background: transparent;
      border: 1px dashed #d9d9d9;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.list {
      }
    }
    .nut-uploader__preview__progress {
      width: 100%;
      height: 100%;
      z-index: 11;
    }
    .nut-uploader__preview-img {
      width: 100%;
      height: 100%;
      border-radius: 9px;
    }
    .picture.nut-uploader__upload {
      position: absolute;
    }
  }
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
    background-color: #4f4dff;
    color: #fff;
    font-size: 14px;
    margin-bottom: 12px;
  }
  .question-card__desc {
    color: #b4b3ff;
    font-size: 14px;
    padding-bottom: 22px;
    border-bottom: 0.5px solid #eee;
    opacity: 0.5;
  }
  .question-card__placeholder {
    color: #bbbbbb;
    font-size: 16px;
  }
  .question-card__main-text {
    margin-top: 30px;
    font-size: 24px;
    color: #fff;
    font-weight: 500;
  }
  .question-card__submit {
    color: #000;
    width: 100%;
    height: 50px;
    border-radius: 9px;
    font-size: 18px;
    font-weight: 500;
  }
  .question-card__main-answer-field {
    display: flex;
    margin: 24px 0 24px;
    border-radius: 9px;
  }
  .question-card__input {
    max-height: 100%;
    height: 200px;
    padding: 13px;
    color: #000;
    overflow: hidden;
  }
  .nut-textarea {
    padding: 0;
    height: 200px;
    height: 100%;
    overflow: hidden;
    border-radius: 9px;
  }
  .nut-uploader__upload {
    width: 254px;
    height: 254px;
    background-color: transparent;
    border-radius: 9px;
    .nutui-iconfont.nut-icon.nut-icon-photograph {
      color: #dad9d9 !important;
      width: 40px;
      height: 40px;
      font-size: 30px;
    }
  }
  .question-card__uploader {
    width: 254px;
    height: 254px;
    padding: 0;
    border-radius: 9px;
  }
}
</style>
