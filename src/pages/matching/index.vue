<template>
  <div class="matching">
    <div class="matching-my-answers" @click="gotoUserPage" v-if="userId">
      <img :src="FileSvg" mode="aspectFill" alt="my answer card" />
      我的答案卡
    </div>
    <ActivityCardList
      class="matching-list"
      showCustomCard
      :getActivityList="getActivityList"
    />
  </div>
</template>
<script setup lang="ts">
import { getActivityList } from '../../api/matching';
import ActivityCardList from '../../biz-components/activityCardList/index.vue';
import FileSvg from '../../assets/images/file.svg';
import Taro from '@tarojs/taro';

const userId = Taro.getStorageSync('USER_ID');

const gotoUserPage = () => {
  Taro.navigateTo({
    url: `/pages/user/index?tab=2&userId=${userId}`,
  });
};
</script>
<style lang="scss">
.matching {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 20px 0px;
  .matching-my-answers {
    flex-shrink: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #999;
    margin-bottom: 4px;
    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
  .matching-list {
    flex-grow: 1;
  }
}
.inline {
  display: inline;
}
</style>
