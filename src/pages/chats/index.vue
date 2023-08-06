<template>
  <view class="chats">
    <nut-config-provider theme="dark" class="full-height">
      <nut-tabs v-model="currentTab">
        <nut-tab-pane title="搭讪我的">
          <scroll-view class="chats-list">
            <LikeMeCard
              v-for="item in chatMeUpList"
              :key="item.user_id"
              :data="item"
              class="chats-item"
            />
          </scroll-view>
        </nut-tab-pane>
        <nut-tab-pane title="我搭讪的">
          <scroll-view class="chats-list">
            <MyLikeCard
              v-for="item in myChatUpList"
              :data="item"
              :key="item.user_id"
              class="chats-item"
            />
          </scroll-view>
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
} from '../../api/matching';
import Taro from '@tarojs/taro';
import { onMounted } from 'vue';

const currentTab = ref('0');
const chatMeUpList = ref<IChatMeUp[]>([]);
const myChatUpList = ref<IMyChatUp[]>([]);
const userId = Taro.getStorageSync('USER_ID');

onMounted(() => {
  getChatMeUpList({ user_id: userId, follow: 0 }).then((res) => {
    chatMeUpList.value = res.data;
  });
  getMyChatUpList({ user_id: userId, follow: 1 }).then((res) => {
    myChatUpList.value = res.data;
  });
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
    padding: 40px 0;
    background-color: #1b1b1b;
    height: $footer-height;
    height: $footer-height-lagecy;
    margin-bottom: constant(safe-area-inset-bottom); ///*兼容 IOS<11.2*/
    margin-bottom: env(safe-area-inset-bottom); ///*兼容 IOS>11.2*/
  }
  .chats-list {
    margin-top: 10px;
  }
}
</style>
