<template>
  <div class="question-card">
    <div class="question-card__header">
      <span class="question-card__tag">问题卡</span>
      <div class="transparent-desc-text question-card__desc">
        {{ tips || '回答后能增加曝光，完成越多问题，越多人看到你' }}
      </div>
    </div>
    <div class="question-card__main">
      <div class="question-card__main-text">
        {{ title }}
      </div>
      <textarea
        class="question-card__input question-card__main-answer-field"
        v-if="type === 1"
        v-model="answer"
        placeholder="回答问题，交换答案"
        placeholderClass="question-card__placeholder"
      />
      <div v-else>
        <Uploader
          ref="uploaderRef"
          v-show="!successImages.length"
          class="question-card__uploader question-card__main-answer-field"
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
      <slot name="extra"></slot>
      <slot name="btn" :info="props" :answer="answer">
        <nut-button
          class="question-card__submit"
          type="primary"
          :disabled="!answer"
          @click="onAnswer"
          >提交</nut-button
        >
      </slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { ref, watch } from 'vue';
import { answerQuestionActivity } from '../../api/matching';
import Uploader from '../../components/uploader/index.vue';
import { computed } from 'vue';

export interface QuestionCardProps {
  type: 1 | 2;
  title: string;
  userId: number;
  id: number;
  activity_id: number;
  tips?: string;
}

const props = defineProps<QuestionCardProps>();
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
  padding: 12px 12px 24px;

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
    margin-top: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
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
    font-size: 14px;
    padding-bottom: 12px;
    border-bottom: 0.5px solid #eee;
  }
  .question-card__placeholder {
    color: #bbbbbb;
    font-size: 16px;
  }
  .question-card__main-text {
    font-size: 24px;
    color: #fff;
    font-weight: bold;
  }
  .question-card__submit {
    color: #000;
    width: 100%;
    height: 50px;
    border-radius: 9px;
    font-size: 18px;
    font-weight: bold;
  }
  .question-card__main-answer-field {
    border-radius: 18rpx;
  }
  .question-card__input {
    width: auto;
    height: 200px;
    padding: 26rpx;
    background-color: #fff;
    overflow: hidden;
    color: #000;
    font-size: 22px;
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
