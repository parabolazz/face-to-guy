<template>
  <div class="activity-detail">
    <div class="activity-detail__title">{{ data?.title }}</div>
    <div class="activity-detail__img">
      <swiper
        autoplay
        circular
        :indicator-dots="true"
        class="activity-detail__imgs"
      >
        <swiper-item
          v-for="(img, index) in data?.activityImgs"
          :key="index"
          class="activity-detail__imgs-item"
        >
          <img
            class="activity-detail__imgs-item-img"
            mode="aspectFill"
            :src="img"
            alt="activity img"
          />
        </swiper-item>
      </swiper>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface ActivityDetail {
  activityId: number;
  title: string;
  activityImgs: string[];
  location: string;
  time: string;
  limit: number;
  current: number;
  userAvatars: string[];
  price?: number;
  desctipion?: string;
}

const props = defineProps<{
  activityId?: number;
  activityDetail?: ActivityDetail;
}>();

const data = ref<ActivityDetail>(
  props.activityDetail || {
    activityId: 1,
    title: '活动标题',
    activityImgs: [
      'https://img.yzcdn.cn/vant/cat.jpeg',
      'https://img.yzcdn.cn/vant/cat.jpeg',
    ],
    location: '活动地点',
    time: '活动时间',
    limit: 10,
    current: 5,
    userAvatars: ['https://picsum.photos/50/50?random=1'],
  },
);
</script>

<style lang="scss">
.activity-detail {
  .activity-detail__title {
    font-size: 22px;
    padding: 8px 12px;
    font-weight: bold;
    color: #ffffff;
  }
}
.activity-detail__imgs {
  padding: 12px;
  margin-bottom: 12px;
  height: 162px;
}
.activity-detail__imgs-item-img {
  width: 100%;
  height: 162px;
  border-radius: 8px;
}
/* Add custom styles for the activity detail page here */
</style>
