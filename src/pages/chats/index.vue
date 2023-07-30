<template>
  <view class="chats">
    <nut-config-provider theme="dark">
      <nut-tabs v-model="currentTab">
        <nut-tab-pane title="搭讪我的">
          <nut-list
            :height="176"
            :margin="12"
            :listData="list"
            class="chats-list"
          >
            <template v-slot>
              <LikeMeCard class="chats-item" />
            </template>
          </nut-list>
          <!-- <virtual-list
            wclass="List"
            :item-data="list"
            :item-size="176"
            :item-count="list.length"
            :item="MyLikeCard"
            :margin="12"
            width="100%"
          /> -->
        </nut-tab-pane>
        <nut-tab-pane title="我搭讪的">
          <div class="chats-list">
            <nut-list
              :height="176"
              :margin="12"
              :listData="list"
              class="chats-list"
            >
              <template v-slot>
                <MyLikeCard class="chats-item" />
              </template>
            </nut-list>
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

const currentTab = ref('0');

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
  background-color: #000;
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
    height: $footer-height;
    height: $footer-height-lagecy;
    margin-bottom: constant(safe-area-inset-bottom); ///*兼容 IOS<11.2*/
    margin-bottom: env(safe-area-inset-bottom); ///*兼容 IOS>11.2*/
  }
}
</style>
