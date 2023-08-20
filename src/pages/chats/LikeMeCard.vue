<template>
  <div class="my-like-card">
    <div v-if="!isRead" class="red-point"></div>
    <div class="my-like-card__info">
      <div class="flex">
        <img
          :src="data.avatar_id"
          alt="avatar"
          class="my-like-card__avatar"
          mode="aspectFill"
        />
        <div class="my-like-card__ids">
          <div class="nick-name">{{ data.nickname }}</div>
          <div class="wechat-id">微信号：{{ data.wechat }}</div>
        </div>
      </div>
      <nut-button
        type="primary"
        plain
        class="my-like-card__btn"
        @click="copyWechatId"
        >复制微信</nut-button
      >
    </div>
    <div class="my-like-card__message">{{ data.message }}</div>
  </div>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { updateMessageRead } from '../../api/message';
import { ref } from 'vue';
import { useGlobalStore } from '../../store';

const props = defineProps<{
  data: {
    user_id: number;
    avatar_id: string;
    nickname: string;
    wechat: string;
    message: string;
    is_read: 1 | 0;
  };
}>();

const isRead = ref(props.data.is_read);
const global = useGlobalStore();
const copyWechatId = async () => {
  try {
    Taro.setClipboardData({
      data: props.data.wechat,
      success: function () {
        Taro.getClipboardData({
          success: function () {
            Taro.showToast({
              title: '复制成功，快回到微信添加好友吧！',
              icon: 'none',
              duration: 2000,
            });
          },
        });
      },
    });
    await updateMessageRead({
      user_id: Taro.getStorageSync('USER_ID'),
      follow_user_id: props.data.user_id,
    });
    isRead.value = 1;
    global.unreadCount = Number(global.unreadCount) - 1 || 0;
  } catch (error) {
    console.log(error);
  }
};
</script>
<style lang="scss">
.my-like-card {
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 12px 12px 16px;
  background-color: #232323;
  border-radius: 9px;
  overflow: visible;
  .red-point {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: red;
    position: absolute;
    right: 0px;
    top: -2px;
    z-index: 1;
  }
  .my-like-card__info {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
  }
  .my-like-card__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
  .my-like-card__ids {
    margin-left: 10px;
    .nick-name {
      font-size: 16px;
      color: #fff;
      font-weight: bold;
    }
    .wechat-id {
      font-size: 14px;
    }
  }
  .my-like-card__btn {
    background-color: transparent !important;
    font-weight: bold;
    border-radius: 10px;
  }
  .my-like-card__message {
    border-radius: 10px;
    opacity: 1;
    background: #404040;
    color: #fff;
    font-size: 14px;
    padding: 12px;
    margin-top: 20px;
  }
}
</style>
