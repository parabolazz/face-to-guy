<template>
  <view class="chats">
    <div class="chats-list">
      <virtual-list
        wclass="List"
        :height="500"
        :item-data="list"
        :item-count="list.length"
        :item-size="74"
        :item="MessageItem"
        width="100%"
      />
    </div>
    <div class="chats-placeholder"></div>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MessageItem from './MessageItem.vue';

function buildData(offset = 0) {
  return Array(10)
    .fill(0)
    .map((_, i) => ({
      lastMessage: i + offset,
      icon: 'https://avatars.githubusercontent.com/u/17560446?s=400&u=39f049596db1669584cca30af065164415e8cd45&v=4',
      name: `name ${i + offset}`,
      time: Date.now() - i * 1000 * 60 * 60 * 24,
      now: Date.now(),
    }));
}

const list = ref(buildData());
</script>

<style lang="scss">
$footer-height: calc(92px + constant(safe-area-inset-bottom));
$footer-height-lagecy: calc(92px + constant(safe-area-inset-bottom));

.chats {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding-bottom: $footer-height;
  padding-bottom: $footer-height-lagecy;
  .chats-list {
  }
  .chats-placeholder {
    padding: 46px 0;
    height: $footer-height;
    height: $footer-height-lagecy;
    margin-bottom: constant(safe-area-inset-bottom); ///*兼容 IOS<11.2*/
    margin-bottom: env(safe-area-inset-bottom); ///*兼容 IOS>11.2*/
  }
}
</style>
