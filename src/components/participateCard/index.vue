<template>
  <div class="participate-card">
    <div class="text-sm text-gray-500 font-bold participate-card__title">
      Q：{{ title }}
    </div>
    <!-- show all users avatar -->
    <div class="flex mt-4 justify-between items-center">
      <div class="flex">
        <div
          v-for="user in users.slice(0, 3)"
          :key="user.nickname"
          class="w-6 h-6 rounded-full participate-card__avatar"
        >
          <img :src="user.avatar" class="w-full h-full rounded-full" />
        </div>
      </div>
      <div class="text-sm text-gray-500">{{ total }}条</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  title: string;
  users: {
    avatar: string;
    nickname: string;
  }[];
  total: number;
}>();
</script>
<style lang="scss">
.participate-card {
  width: 120px;
  height: 90px;
  padding: 10px;
  background-color: #232323;
  border-radius: 10px;

  .participate-card__title {
    display: -webkit-box;
    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    color: #dbf378;
  }
  .participate-card__avatar {
    margin-right: -6px;
    border: 2px solid #fff;
  }
}
</style>
