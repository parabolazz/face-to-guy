<template>
  <div class="create-question-card">
    <div class="create-question-card__header">
      <span class="create-question-card__tag">问题卡</span>
      <div class="create-question-card__desc">
        <div class="create-question-card__desc-text">题目类型：</div>
        <nut-radio-group v-model="type" direction="horizontal">
          <nut-radio :label="1">文字题</nut-radio>
          <nut-radio :label="2">图片题</nut-radio>
        </nut-radio-group>
      </div>

      <nut-divider
        hairline
        :style="{ opacity: 0.3, color: '#fff', borderColor: '#fff' }"
      />
    </div>
    <div class="create-question-card__main">
      <div class="create-question-card__main-text">你的问题</div>
      <div class="create-question-card__main-answer-field">
        <nut-textarea
          class="create-question-card__input"
          v-if="type === 1"
          input-align="left"
          :border="false"
          v-model="answer"
          placeholder="回答问题，交换答案"
          placeholder-class="create-question-card__placeholder"
        />
        <!-- <Uploader
            ref="uploaderRef"
            v-show="!successImages.length"
            class="create-question-card__uploader"
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
            class="create-question-card__uploader"
            :src="images[0] ? images[0].url : ''"
            alt="answer image"
            mode="aspectFill"
            @click="replaceImage"
          /> -->
      </div>
      <nut-divider
        hairline
        :style="{ opacity: 0.3, color: '#fff', borderColor: '#fff' }"
      />

      <nut-button
        class="create-question-card__submit"
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
  title: string;
  userId: number;
  id: number;
}>();
const instance = Taro.getCurrentInstance();
const type = ref(1);
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
.create-question-card {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #67a4ff;
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
  .create-question-card__header {
    flex-shrink: 0;
  }
  .create-question-card__main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .create-question-card__tag {
    display: inline-block;
    padding: 7px 12px;
    border-radius: 30px;
    background-color: #4d94ff;
    color: #fff;
    font-size: 14px;
    margin-bottom: 12px;
  }
  .create-question-card__desc {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 14px;
  }
  .create-question-card__placeholder {
    color: #bbbbbb;
    font-size: 16px;
  }
  .create-question-card__main-text {
    font-size: 16px;
    color: #fff;
  }
  .create-question-card__submit {
    color: #000;
    width: 100%;
    height: 50px;
    border-radius: 9px;
    font-size: 18px;
    font-weight: 500;
  }
  .create-question-card__main-answer-field {
    display: flex;
    margin: 10px 0 4px;
    border-radius: 9px;
  }
  .create-question-card__input {
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
  .create-question-card__uploader {
    width: 254px;
    height: 254px;
    padding: 0;
    border-radius: 9px;
  }
  .create-question-card__desc-text {
    opacity: 0.7;
  }
}
</style>
