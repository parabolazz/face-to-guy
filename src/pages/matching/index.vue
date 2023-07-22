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
          @goChat="goChat"
        ></AnswerCard>
        <div v-else>马上加载更多内容！</div>
      </swiper-item>
    </swiper>

    <nut-dialog
      v-model:visible="takeEnoughShotDialog"
      cancel-text="我再想想"
      @cancel="onCancel"
      @ok="onConfirmGoChat"
    >
      <template #header>
        <div class="shot-title">
          打招呼需消耗<span class="shot-count"> 1 </span> 杯 Shot
        </div>
      </template>
      <div class="shot-desc">
        当前拥有<span class="shot-count">{{ userShot }}</span
        >杯 Shot，确认消耗<span class="shot-count">1</span>
        杯 Shot 向对方打招呼吗？
      </div>
    </nut-dialog>
    <nut-dialog
      v-model:visible="noShotDialog"
      cancel-text="我再想想"
      ok-text="做任务"
      @cancel="onCancel"
      @ok="onOpenSharePopup"
    >
      <template #header>
        <div class="shot-title">😯当前Shot不够！</div>
      </template>
      <div class="shot-desc">
        <span class="inline">打招呼需要消耗</span>
        <span class="shot-count">1</span>
        <span class="inline"
          >杯Shot，当前Shot已消耗完，快去做任务补充Shot吧！</span
        >
      </div>
    </nut-dialog>
    <nut-config-provider theme="dark">
      <SharePopup v-model:visible="sharePopupVisible" />
    </nut-config-provider>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { IMatchItem, getActivityList } from '../../api/matching';
import QuestionCard from '../../components/questionCard/index.vue';
import AnswerCard from '../../components/answerCard/index.vue';
import { computed } from 'vue';
import { watch } from 'vue';
import { nextTick } from '@tarojs/taro';
import SharePopup from '../../biz-components/sharePopup/index.vue';

const PAGE_SIZE = 11;

const idx = ref(0);
const isLastPage = computed(() => activityList.value.length < PAGE_SIZE);
const currentPage = ref(0);
const activityList = ref<(IMatchItem & { cardType: string })[]>([]);
const prepareActivityList = ref<(IMatchItem & { cardType: string })[]>([]);
const takeEnoughShotDialog = ref(false);
const noShotDialog = ref(true);
const sharePopupVisible = ref(false);
const onOpenSharePopup = () => {
  noShotDialog.value = false;
  sharePopupVisible.value = true;
};

const userShot = ref(23);

async function fetchData() {
  try {
    const { data } = await getActivityList({
      current_page: currentPage.value,
      activity_id: 1,
    });
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
    currentPage.value += 1;
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
const goChat = () => {
  console.log('goChat');
};
const onConfirmGoChat = () => {
  takeEnoughShotDialog.value = false;
  goChat();
};
const onCancel = () => {
  takeEnoughShotDialog.value = false;
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
      // 跳转到下一页
      setTimeout(() => {
        activityList.value = [];
        idx.value = 0;
        currentPage.value += 1;
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
  .matching-swiper {
    height: 613px;
    overflow: hidden;
    .matching-swiper__card {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #6967ff;
      height: 100%;
      color: #fff;
      border-radius: 9px;
    }
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
    font-weight: 500;
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
}
.inline {
  display: inline;
}
</style>
