<template>
  <div class="my-like-card">
    <div class="my-like-card__info">
      <div class="flex">
        <img :src="data.avatar_id" alt="avatar" class="my-like-card__avatar" />
        <div class="my-like-card__ids">
          <div class="nick-name">{{ data.nickname }}</div>
          <div class="wechat-id">{{ basicInfo }}</div>
        </div>
      </div>
      <nut-button
        type="primary"
        plain
        class="my-like-card__btn"
        @click="goToUserPage"
      >
        看主页</nut-button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { Attribute, Shape } from '../../utils/profileEnum';
import Taro from '@tarojs/taro';
import { useGlobalStore } from '../../store';

const global = useGlobalStore();
const props = defineProps<{
  data: {
    avatar_id: string;
    nickname: string;
    attribute: number;
    height: number;
    weight: number;
    shape: number;
    user_id: number;
  };
}>();

const basicInfo = computed(() => {
  if (!props.data) return '';
  const { attribute, height, weight, shape } = props.data;
  // @ts-ignore
  const attrText = Attribute[attribute];
  // @ts-ignore
  const shapeText = Shape[shape];
  const descArr = [
    attrText,
    height ? height + 'cm' : undefined,
    weight ? weight + 'kg' : undefined,
    shapeText,
  ];
  return descArr.filter((item) => item).join(' / ');
});

const goToUserPage = () => {
  if (global.userProfile) {
    Taro.navigateTo({
      url: `/pages/user/index?userId=${props.data.user_id}`,
    });
  } else {
    Taro.navigateTo({
      url: `/pages/login/index`,
    });
  }
};
</script>
<style lang="scss">
.my-like-card {
  display: flex;
  padding: 12px 12px 16px;
  background-color: #232323;
  border-radius: 9px;
  overflow: hidden;
  .my-like-card__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
