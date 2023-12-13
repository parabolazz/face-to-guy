<template>
  <nut-action-sheet
    :close-abled="false"
    :visible="visible"
    class="pairs-popup new-profile-popup"
  >
    <div class="pairs-popup__content new-profile-popup__content">
      <nut-form
        :model-value="infoForm"
        ref="formRef"
        :rules="rules"
        class="new-profile__form"
      >
        <div>
          <nut-form-item
            prop="wechatId"
            label="你的头像"
            required
            style="margin-bottom: 8px"
          >
            <Uploader
              is-avatar
              ref="uploaderRef"
              v-show="!infoForm.avatar"
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
              @success="onUploadSuccess"
              @failure="onUploadFailure"
              @delete="onDelete"
            />
            <img
              v-if="infoForm.avatar"
              class="create-question-card__uploader"
              :src="infoForm.avatar"
              alt="answer image"
              mode="aspectFill"
              @click="replaceImage"
            />
          </nut-form-item>
          <nut-form-item
            prop="message"
            label="你的昵称"
            required
            class="new-profile-popup__msg-item"
          >
            <input
              class="new-profile-popup__msg-item-input"
              cursor-spacing="50"
              v-model="infoForm.nickname"
              placeholder="请输入你的昵称"
              max-length="50"
              type="text"
              :border="false"
            />
          </nut-form-item>
        </div>
        <nut-form-item class="form-item-submit">
          <nut-button
            type="primary"
            class="submit-btn"
            @click="onChat"
            :loading="loading"
            >保存</nut-button
          >
        </nut-form-item>
      </nut-form>
    </div>
  </nut-action-sheet>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import Taro from '@tarojs/taro';
import Uploader from '../../components/uploader/index.vue';
import { editProfile } from '../../api/user';

const props = defineProps<{ visible: boolean }>();

const images = ref<
  {
    url: string;
    status: string;
  }[]
>([]);
const authToken = ref(Taro.getStorageSync('TOKEN'));
const uploaderRef = ref();

const emit = defineEmits([
  'update:visible',
  'onOpenSharePopup',
  'finishEditProfile',
]);
const formRef = ref();
const infoForm = ref({
  avatar: '',
  nickname: '',
});
const rules = computed(() => ({
  avatar: [{ required: true, message: '请上传你的头像' }],
  message: [{ required: true, message: '请输入你的昵称' }],
}));
const loading = ref(false);

const replaceImage = () => {
  uploaderRef.value.chooseImage();
};

const onDelete = () => {
  images.value = [];
};

const onUploadSuccess = () => {
  infoForm.value.avatar = images.value[0].url;
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

const onChat = async () => {
  const data = {
    avatar_ids: [infoForm.value.avatar],
    nickname: infoForm.value.nickname,
    shot: 10,
  };
  await editProfile(data);
  Taro.showToast({
    title: '注册成功！可以继续操作啦～',
    icon: 'none',
  });
  emit('finishEditProfile');
};

watch(
  () => props.visible,
  (val) => {
    if (val) {
      authToken.value = Taro.getStorageSync('TOKEN');
    }
  },
);
</script>
<style lang="scss">
.new-profile-popup {
  .nut-popup {
    height: calc(350px + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
  }
  .new-profile-popup__content {
    padding-top: 30px;
  }

  .nut-cell-group__wrap {
    height: 340px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    background-color: #2c2c2c;
  }
  .nut-form-item {
    flex-direction: column;
    .nut-form-item__label {
      width: 100%;
      margin-bottom: 10px;
    }
    .h5-textarea {
      padding: 10px 12px;
      height: 82px;
    }
  }
  .nut-cell::after {
    display: none;
  }
  .form-item-submit {
    padding-top: 5px;
  }

  .submit-btn {
    color: #000;
    width: 100%;
    height: 50px;
    border-radius: 9px;
    font-size: 18px;
    font-weight: bold;
  }
  .nut-cell-group__wrap {
    margin: 0;
  }
  .new-profile-popup__msg-item .nut-form-item__body__slots {
    display: flex;
  }
  .new-profile-popup__msg-item-input {
    padding: 10px 12px;
    border-radius: 9px;
    background: #474747;
    width: 100%;
  }
  .new-profile-popup__msg-item-textarea {
    flex: 1;
    border-radius: 9px;
    background: #474747;
    flex: 1;
  }

  .nut-uploader__upload {
    width: 82px;
    height: 82px;
    background-color: transparent;
    border-radius: 9px;
    .nutui-iconfont.nut-icon.nut-icon-photograph {
      color: #dad9d9 !important;
      width: 12px;
      height: 12px;
      font-size: 20px;
    }
  }
  .create-question-card__uploader {
    display: block;
    width: 82px;
    height: 82px;
    padding: 0;
    border-radius: 9px;
    margin: 0 auto;
  }
  .nut-uploader {
    padding: 0 0 5px;
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
}
</style>
