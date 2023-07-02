<template>
  <div class="matching">
    <swiper
      class="matching-swiper"
      indicator-color="#999"
      indicator-active-color="#333"
      :vertical="true"
      :circular="false"
      :indicator-dots="false"
      :autoplay="false"
      :current="idx"
      :scrollWithAnimation="false"
      @change="onSwipe"
    >
      <swiper-item
        class="matching-swiper__card"
        v-for="(item, index) in activityList"
        :key="item.id"
      >
        <QuestionCard
          v-if="item.cardType === 'question'"
          :title="item.title"
          :type="item.type"
          @onAnswer="onAnswer"
        />
        <AnswerCard
          v-else-if="item.cardType === 'answer'"
          v-bind="item"
          :isActive="idx === index"
        ></AnswerCard>
        <div v-else>马上加载更多内容！</div>
      </swiper-item>
    </swiper>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  IMatchItem,
  getActivityList,
  // answerQuestionActivity,
} from '../../api/matching';
import QuestionCard from '../../components/questionCard/index.vue';
import AnswerCard from '../../components/answerCard/index.vue';
import { computed } from 'vue';
import { watch } from 'vue';
import { nextTick } from '@tarojs/taro';

const PAGE_SIZE = 11;

const idx = ref(0);
const isLastPage = computed(() => activityList.value.length < PAGE_SIZE);
const activityList = ref<(IMatchItem & { cardType: string })[]>([]);
const prepareActivityList = ref<(IMatchItem & { cardType: string })[]>([]);

async function fetchData() {
  try {
    const { data } = await getActivityList();
    const questionList = (data.question || []).map((item) => ({
      ...item,
      cardType: 'question',
    }));
    const answerList = (data.answer || []).map((item) => ({
      ...item,
      cardType: 'answer',
    }));
    const adList = (data.ad || []).map((item) => ({
      ...item,
      cardType: 'ad',
    }));
    const nextPage = {
      cardType: 'next',
      id: -1,
      title: '广告',
      type: 1,
    };
    return questionList.concat(answerList, adList, [nextPage]);
  } catch (error) {
    return [];
  }
}
async function init() {
  const data = await fetchData();
  activityList.value = data;
}
const onSwipe = (e: any) => {
  idx.value = e.detail.current;
};
const onAnswer = () => {
  if (idx.value < activityList.value.length - 1) {
    idx.value += 1;
  } else {
    fetchData();
    idx.value = 0;
  }
};
init();
watch(
  () => idx.value,
  async (v) => {
    console.log('idx', v, v === PAGE_SIZE);
    if (v === PAGE_SIZE - 3 && !isLastPage.value) {
      console.log('trigger!');
      prepareActivityList.value = await fetchData();
    } else if (v === PAGE_SIZE - 1) {
      setTimeout(() => {
        activityList.value = [];
        idx.value = 0;
        nextTick(() => {
          activityList.value = prepareActivityList.value;
          prepareActivityList.value = [];
        });
      }, 1000);
    }
  },
);
</script>
<style lang="scss">
.matching {
  height: 100%;
  padding: 54px 12px;
  .matching-swiper {
    height: 565px;
    overflow: hidden;
    .matching-swiper__card {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #6967ff;
      height: 560px;
      color: #fff;
      border-radius: 9px;
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
