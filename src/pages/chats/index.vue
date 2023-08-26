<template>
  <view class="chats">
    <nut-config-provider theme="dark" class="full-height">
      <nut-tabs v-model="currentTab">
        <nut-tab-pane title="搭讪我的">
          <scroll-view v-if="global.userProfile">
            <nut-noticebar
              text="请注意甄别虚假信息，注意个人人身财产安全"
              :background="'#1b1b1b'"
              :color="`#D9500B`"
            ></nut-noticebar>
            <LikeMeCard
              v-for="item in chatMeUpList"
              :key="item.user_id"
              :data="item"
              class="chats-item"
            />
          </scroll-view>
          <div class="login-tips" v-else>
            请先进行
            <div class="login-tips__btn" @click="goToLogin">登录</div>
          </div>
        </nut-tab-pane>
        <nut-tab-pane title="我搭讪的">
          <scroll-view class="chats-list" v-if="global.userProfile">
            <MyLikeCard
              v-for="item in myChatUpList"
              :data="item"
              :key="item.user_id"
              class="chats-item"
            />
          </scroll-view>
          <div class="login-tips" v-else>
            请先进行
            <div class="login-tips__btn" @click="goToLogin">登录</div>
          </div>
        </nut-tab-pane>
      </nut-tabs>
      <div class="chats-placeholder"></div>
    </nut-config-provider>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MyLikeCard from './MyLikeCard.vue';
import LikeMeCard from './LikeMeCard.vue';
import {
  getChatMeUpList,
  getMyChatUpList,
  IChatMeUp,
  IMyChatUp,
} from '../../api/message';
import Taro from '@tarojs/taro';
import { useGlobalStore } from '../../store';

const global = useGlobalStore();
const currentTab = ref('0');
const chatMeUpList = ref<IChatMeUp[]>([]);
const myChatUpList = ref<IMyChatUp[]>([]);

const goToLogin = () => {
  Taro.navigateTo({
    url: '/pages/login/index',
  });
};

Taro.useDidShow(() => {
  if (Taro.getStorageSync('TOKEN')) {
    const userId = Taro.getStorageSync('USER_ID');

    getChatMeUpList({ user_id: userId, follow: 0 }).then((res) => {
      chatMeUpList.value = res.data;
    });
    getMyChatUpList({ user_id: userId, follow: 1 }).then((res) => {
      myChatUpList.value = res.data;
    });
  }
});
</script>

<style lang="scss">
$footer-height: calc(92px + constant(safe-area-inset-bottom));
$footer-height-lagecy: calc(92px + constant(safe-area-inset-bottom));

.chats {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #1b1b1b;
  height: 100%;
  padding-bottom: $footer-height;
  padding-bottom: $footer-height-lagecy;
  .nut-tab-pane {
    padding: 0 12px;
  }
  .chats-item {
    margin-bottom: 12px;
  }
  .chats-placeholder {
    padding: 46px 0;
    background-color: #1b1b1b;
    height: $footer-height;
    height: $footer-height-lagecy;
    margin-bottom: constant(safe-area-inset-bottom); ///*兼容 IOS<11.2*/
    margin-bottom: env(safe-area-inset-bottom); ///*兼容 IOS>11.2*/
  }
  .chats-list {
    margin-top: 10px;
  }
  .login-tips {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    .login-tips__btn {
      text-decoration: underline;
      color: #dbf378;
    }
  }
}
</style>
