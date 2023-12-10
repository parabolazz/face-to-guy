<template>
  <div class="participate-card" @click="jumpToDetail">
    <div class="text-sm text-gray-500 font-bold participate-card__title">
      Q：{{ title }}
    </div>
    <!-- show all users avatar -->
    <div class="flex mt-4 justify-between items-center">
      <div class="flex">
        <div
          v-for="avatar in avatars.slice(0, 20)"
          :key="avatar"
          class="w-6 h-6 rounded-full participate-card__avatar"
        >
          <img :src="avatar" class="w-full h-full rounded-full" />
        </div>
      </div>
      <div class="text-sm text-gray-500">{{ total }}条</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro';

const props = defineProps<{
  shareId: string;
  title: string;
  avatars: string[];
  total: number;
}>();

const jumpToDetail = () => {
  Taro.navigateTo({
    url: `/pages/share-ques-detail/index?shareId=${props.shareId}`,
  });
};
</script>
<style lang="scss">
.participate-card {
  width: 120px;
  height: 90px;
  padding: 10px;
  background-color: #232323;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .participate-card__title {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -moz-box;
    -moz-line-clamp: 2;
    -moz-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
    overflow: hidden;
    overflow: hidden;
    color: #dbf378;
    line-height: 1.3;
  }
  .participate-card__avatar {
    margin-right: -6px;
    border: 2px solid #fff;
  }
}
// all the tailwind classes that used in this template

.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.mt-4 {
  margin-top: 1rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-500 {
  color: #a0aec0;
}
.font-bold {
  font-weight: 700;
}
.rounded-full {
  border-radius: 9999px;
}
.w-6 {
  width: 1.5rem;
}
.h-6 {
  height: 1.5rem;
}
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
.text-gray-500 {
  color: #a0aec0;
}
</style>
