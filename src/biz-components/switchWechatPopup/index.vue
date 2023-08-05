<template>
  <nut-action-sheet
    :visible="visible"
    class="pairs-popup switch-wechat-popup"
    @update:visible="onToggleVisible"
  >
    <div class="pairs-popup__content switch-wechat-popup__content">
      <nut-form
        :model-value="infoForm"
        ref="formRef"
        :rules="rules"
        class="switch-wechat__form"
      >
        <div>
          <nut-form-item prop="wechatId" label="你的微信号" required>
            <nut-input
              v-model="infoForm.wechatId"
              placeholder="请输入你的微信号"
              max-length="50"
              type="text"
              :border="false"
            ></nut-input>
          </nut-form-item>
          <nut-form-item prop="message" label="给对方的留言" required>
            <nut-textarea
              rows="3"
              limit-show
              v-model="infoForm.message"
              placeholder="真诚的留言有助于对方了解你"
              max-length="50"
              :border="false"
            />
          </nut-form-item>
        </div>
        <nut-form-item>
          <nut-button
            type="primary"
            class="submit-btn"
            @click="onChat"
            :loading="loading"
            >消耗一杯Shot打招呼</nut-button
          >
        </nut-form-item>
      </nut-form>
    </div>
  </nut-action-sheet>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import Taro from '@tarojs/taro';
import { useGlobalStore } from '../../store';
import { leaveMessage } from '../../api/matching';

const props = defineProps<{
  visible: boolean;
  targetUserId: number;
}>();

const global = useGlobalStore();
const emit = defineEmits(['update:visible', 'onOpenSharePopup']);
const formRef = ref();
const infoForm = ref({
  wechatId: Taro.getStorageSync('USER_WECHAT_ID') || '',
  message: '',
});
const rules = computed(() => ({
  wechatId: [{ required: true, message: '请输入微信号' }],
  message: [{ required: true, message: '请输入你的留言' }],
}));
const loading = ref(false);

const onToggleVisible = (visible: boolean) => {
  emit('update:visible', visible);
};

const onChat = async () => {
  try {
    const { valid } = await formRef.value.validate();
    console.log('valid', valid);
    if (!valid) {
      return;
    }
    if (Number(global.userProfile?.shot) > 1) {
      Taro.showToast({
        title: 'Shot不足, 快去做任务获取shot吧！',
        icon: 'none',
      });
      emit('onOpenSharePopup');
      return;
    }
    loading.value = true;
    await leaveMessage({
      user_id: Taro.getStorageSync('USER_ID'),
      follow_user_id: props.targetUserId,
      wechat: infoForm.value.wechatId,
      message: infoForm.value.message,
    });
    Taro.setStorageSync('USER_WECHAT_ID', infoForm.value.wechatId);
    Taro.showToast({
      title: '打招呼成功！',
      icon: 'none',
    });
    onToggleVisible(false);
  } finally {
    loading.value = false;
  }
};
</script>
<style lang="scss">
.switch-wechat-popup {
  .nut-popup {
    height: calc(350px + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
  }
  .switch-wechat-popup__content {
    padding-top: 20px;
  }

  .nut-cell-group__wrap {
    height: 339px;
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
    .nut-input,
    .nut-textarea {
      padding: 10px 12px;
      border-radius: 9px;
      background: #474747;
    }
    .h5-textarea {
      padding: 10px 12px;
      height: 82px;
    }
  }

  .submit-btn {
    color: #000;
    width: 100%;
    height: 50px;
    border-radius: 9px;
    font-size: 18px;
    font-weight: 500;
  }
  .switch-wechat__form {
  }
  .nut-cell-group__wrap {
    margin: 0;
  }
}
</style>
