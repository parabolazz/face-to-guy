<template>
  <div>
    <swiper
      v-if="!isFetchingFirst"
      class="matching-swiper"
      indicator-dots
      :vertical="true"
      :circular="false"
      next-margin="20px"
      :autoplay="false"
      :current="idx"
      :scrollWithAnimation="false"
      @change="onSwipe"
    >
      <swiper-item
        v-for="(item, index) in activityList"
        :key="item.id"
        :class="['matching-swiper__card', idx === index ? 'swiper-active' : '']"
      >
        <div class="matching-swiper__card-content">
          <div v-if="item.cardType === 'next'">
            <div
              class="matching-swiper__card-loading"
              v-if="prepareActivityList.length > 1"
            >
              <Loading size="46" />
              <div class="matching-swiper__card-loading-text">Loading...</div>
            </div>
            <div v-else>
              <slot name="last"> 已经滑到底啦！ </slot>
            </div>
          </div>
          <slot
            v-else
            name="item"
            :data="item"
            :index="index"
            :currentIdx="idx"
          ></slot>
        </div>
      </swiper-item>
    </swiper>
    <div class="matching-loading-container" v-else>
      <Loading size="46" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineExpose } from 'vue';
import { IMatchItem } from '../../api/matching';
import { computed } from 'vue';
import { watch } from 'vue';
import { nextTick } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { Loading } from '@nutui/icons-vue-taro';

const props = withDefaults(
  defineProps<{
    randomCards: boolean;
    showCustomCard: boolean;
    getValidCardLength: (list: IMatchItem[]) => boolean;
    getActivityList: (data: {
      a_id: number;
      user_id: number;
      groups: string;
      page_num?: number;
    }) => Promise<{
      data: {
        ad: IMatchItem[] | null;
        answer: IMatchItem[] | null;
        question: IMatchItem[] | null;
        issue: IMatchItem;
        group: number;
      };
    }>;
  }>(),
  {
    randomCards: true,
    showCustomCard: false,
  },
);

// 一天展示一次 custom card
const getShouldShowCustomCard = () => {
  if (!props.showCustomCard) return false;
  const lastShowTime = Taro.getStorageSync('CUSTOM_CARD_LAST_SHOW_TIME');
  const now = new Date().getTime();
  if (!lastShowTime) {
    return true;
  }
  if (now - lastShowTime > 24 * 60 * 60 * 1000) {
    return true;
  }
  return false;
};

const instance = Taro.getCurrentInstance();
const idx = ref(-1);
const pageNum = ref(1);
const activityList = ref<(IMatchItem & { cardType: string })[]>([]);
const prepareActivityList = ref<(IMatchItem & { cardType: string })[]>([]);
const walkGroups = ref<number[]>([]);
const isFetchingFirst = ref(false);
const shouldShowCustomCard = ref(getShouldShowCustomCard());
const activityId = computed(() => instance?.router?.params.activityId);
const emits = defineEmits<{
  (e: 'changeCurrent', data: IMatchItem);
}>();

async function fetchData() {
  if (pageNum.value === 1) {
    isFetchingFirst.value = true;
  }
  try {
    const res = await props.getActivityList({
      a_id: Number(activityId.value) || 0,
      groups: walkGroups.value.join(','),
      user_id: Number(Taro.getStorageSync('USER_ID')) || 0,
      page_num: pageNum.value,
    });
    if (res) {
      const { data } = res;
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
      const customQuesList = shouldShowCustomCard.value
        ? [
            {
              cardType: 'customQuestion',
            } as IMatchItem & { cardType: string },
          ]
        : [];
      if (shouldShowCustomCard.value) {
        shouldShowCustomCard.value = false;
        Taro.setStorageSync('CUSTOM_CARD_LAST_SHOW_TIME', Date.now());
      }
      const nextPage = {
        cardType: 'next',
        id: -1,
        title: '广告',
        type: 1,
      };
      data.group && walkGroups.value.push(data.group);
      const originList = questionList.concat(answerList, adList);
      // 打乱一下主卡片的顺序
      if (props.randomCards) {
        originList.sort(() => Math.random() - 0.5);
      }
      isFetchingFirst.value = false;
      return originList.concat(customQuesList, [nextPage]);
    }
    return [];
  } catch (error) {
    return [];
  }
}
async function init() {
  pageNum.value = 1;
  const data = await fetchData();
  activityList.value = data;
  idx.value = 0;
}
const onSwipe = (e: any) => {
  idx.value = e.detail.current;
};
const changeIndex = (index: number) => {
  idx.value = index;
};
init();
watch(idx, async (v, oldV) => {
  // 当前数据量为满额时，划到倒数第三页的时候请求下一页数据
  const validCardList = props.getValidCardLength(activityList.value);
  emits('changeCurrent', activityList.value[v]);
  // 从下往上滑
  if (oldV - v === 1) {
    return;
  }
  // 刷到第一条的时候就请求下一条
  if (v === 0) {
    if (validCardList) {
      pageNum.value += 1;
      prepareActivityList.value = await fetchData();
    }
    // 刷到最后一条有内容的数据的时候，并且有可替换的内容，准备替换内容
  } else if (
    v === activityList.value.length - 1 &&
    prepareActivityList.value.length > 1
  ) {
    // 跳转到下一页
    setTimeout(() => {
      activityList.value.splice(0, activityList.value.length - 1);
      idx.value = 0;
      nextTick(() => {
        activityList.value = prepareActivityList.value;
        prepareActivityList.value = [];
      });
    }, 500);
  }
});

defineExpose({
  changeIndex,
  fetchData,
  init,
  idx,
});
</script>
<style lang="scss">
.matching-swiper {
  height: 633px;
  overflow: visible;
  .matching-swiper__card {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 613px !important;
    overflow: visible;
    .matching-swiper__card-content {
      opacity: 0.5;
      width: 90% !important;
      height: 600px;
      background-color: #6967ff;
      border-radius: 9px;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.2s ease 0s;
    }
    &.swiper-active {
      .matching-swiper__card-content {
        top: 0;
        opacity: 1;
        width: 100% !important;
      }
    }
  }
  .matching-swiper__card-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .matching-swiper__card-loading-text {
    font-size: 18px;
    font-weight: 700;
    margin-top: 10px;
  }
}
.matching-loading-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  margin-top: 200px;
  background-color: transparent;
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
.nut-dialog__header {
  height: auto;
}
.nut-dialog__footer .nut-button {
  width: 117px;
  height: 40px;
  border-radius: 9px;
  font-size: 14px;
}
.nut-dialog__footer-cancel {
  border-color: #000;
  color: #000;
}
.nut-dialog__footer-ok {
  border-color: #000;
  background-color: #000;
  color: #dbf378;
}
.shot-title {
  display: flex;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #000;
}
.shot-desc {
  font-size: 15px;
  line-height: 20px;
  color: #333333;
}
.shot-count {
  display: inline;
  color: #6967ff;
  margin: 0 2px;
}
.inline {
  display: inline;
}
</style>
