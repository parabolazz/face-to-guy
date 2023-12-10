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
          <nut-form-item
            prop="wechatId"
            label="你的微信号"
            required
            style="margin-bottom: 8px"
          >
            <input
              class="switch-wechat-popup__msg-item-input"
              cursor-spacing="50"
              v-model="infoForm.wechatId"
              placeholder="请输入你的微信号"
              max-length="50"
              type="text"
              :border="false"
            />
          </nut-form-item>
          <nut-form-item
            prop="message"
            label="给对方的留言"
            required
            class="switch-wechat-popup__msg-item"
          >
            <textarea
              class="switch-wechat-popup__msg-item-textarea"
              cursor-spacing="50"
              rows="3"
              limit-show
              v-model="infoForm.message"
              placeholder="真诚的留言有助于对方了解你，请勿发送色情低俗，骚扰攻击等违法违规信息"
              max-length="50"
              :border="false"
            />
          </nut-form-item>
        </div>
        <nut-form-item class="form-item-submit">
          <nut-button
            type="primary"
            class="submit-btn"
            @click="onChat"
            :disabled="disabled"
            :loading="loading"
            >{{ disabled ? '你已打过招呼' : '消耗一杯Shot打招呼' }}</nut-button
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
import { leaveMessage } from '../../api/message';
import { Action, updateShot } from '../../api/user';

const props = defineProps<{
  visible: boolean;
  targetUserId: number;
}>();

const global = useGlobalStore();
const hasChatMap = Taro.getStorageSync('HAS_CHAT_MAP') || {};

const emit = defineEmits(['update:visible', 'onOpenSharePopup']);
const formRef = ref();
const infoForm = ref({
  wechatId: Taro.getStorageSync('USER_WECHAT_ID') || '',
  message: '',
});
const disabled = computed(() => {
  return false || hasChatMap[props.targetUserId];
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
    if (!global.userProfile) {
      Taro.navigateTo({ url: '/pages/login/index' });
      return;
    }
    const { valid } = await formRef.value.validate();
    if (!valid || !global.userProfile?.shot) {
      return;
    }
    if (Number(global.userProfile.shot) < 1) {
      Taro.showToast({
        title: 'Shot不足, 快去做任务获取shot吧！',
        icon: 'none',
      });
      emit('onOpenSharePopup');
      return;
    }
    loading.value = true;
    await updateShot(1, Action.Consume);
    global.setUserProfile({
      ...global.userProfile!,
      shot: Number(global.userProfile.shot) - 1,
    });
    await leaveMessage({
      user_id: Taro.getStorageSync('USER_ID'),
      follow_user_id: props.targetUserId,
      wechat: infoForm.value.wechatId,
      message: infoForm.value.message,
    });
    Taro.setStorageSync('USER_WECHAT_ID', infoForm.value.wechatId);
    Taro.showToast({
      title: '打招呼成功，对方看到后会加你微信哦',
      icon: 'none',
    });
    hasChatMap[props.targetUserId] = 1;
    Taro.setStorage({ key: 'HAS_CHAT_MAP', data: hasChatMap });
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
  .switch-wechat-popup__msg-item .nut-form-item__body__slots {
    display: flex;
  }
  .switch-wechat-popup__msg-item-input {
    padding: 10px 12px;
    border-radius: 9px;
    background: #474747;
  }
  .switch-wechat-popup__msg-item-textarea {
    flex: 1;
    border-radius: 9px;
    background: #474747;
    flex: 1;
  }
}
</style>
