<template>
  <div class="matching">
    <swiper
      class="matching-swiper"
      indicator-color="#999"
      indicator-active-color="#333"
      :vertical="true"
      previous-margin="80rpx"
      next-margin="80rpx"
      :circular="false"
      :indicator-dots="false"
      :autoplay="false"
      @change="onSwipe"
    >
      <swiper-item class="matching-swiper__card">
        <div class="demo-text-1">1</div>
      </swiper-item>
      <swiper-item class="matching-swiper__card">
        <div class="demo-text-2">2</div>
      </swiper-item>
      <swiper-item class="matching-swiper__card">
        <div class="demo-text-3">3</div>
      </swiper-item>
    </swiper>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { activityList, answerQuestionActivity } from '../../api/matching';

const idx = ref(0);
// async function init() {
//   const res = await activityList();
//   const firstAnswer = res.data[0];
//   setTimeout(() => {
//     answerQuestionActivity({
//       activity_id: firstAnswer.id,
//       answer: 'yihuang ceshi',
//     });
//   }, 3000);
// }
// init();
const onSwipe = (e: any) => {
  console.log(e);
  idx.value = e.detail.current;
};
</script>
<style lang="scss">
.matching {
  height: 100%;
  padding: 54px 12px;
  .matching-swiper {
    height: 560px;
    .matching-swiper__card {
      background-color: #6967ff;
      height: 560px;
      color: #fff;
    }
  }

  swiper {
    padding-top: 30px;
  }
  .swiper-img {
    width: 100%;
    display: block;
    transform: scale(0.8);
    transition: all 0.3s ease;
    border-radius: 6px;
  }
  .swiper-img.swiper-active {
    transform: scale(1); //放大缩放的效果
  }
}
</style>
