<template>
  <div>
    <swiper
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
          <QuestionCard
            v-if="item.cardType === 'question'"
            :userId="userId"
            :title="item.title"
            :type="item.type"
            :id="item.id"
            @onAnswer="onAnswer"
          />
          <AnswerCard
            v-else-if="item.cardType === 'answer'"
            v-bind="item"
            :isActive="idx === index"
            @goChat="goChat"
          ></AnswerCard>
          <CustomQuesCard
            v-else-if="item.cardType === 'customQuestion'"
            :userId="userId"
            @onAnswer="onAnswer"
          ></CustomQuesCard>
          <div v-else>
            {{
              prepareActivityList.length > 1
                ? '马上加载更多内容！'
                : '已经滑到底啦！'
            }}
          </div>
        </div>
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
    <nut-config-provider
      theme="dark"
      :themeVars="{
        darkBackground2: '#2c2c2c',
      }"
    >
      <SwitchWechatPopup
        :targetUserId="targetUserId"
        v-model:visible="switchWechatVisible"
        @onOpenSharePopup="onOpenSharePopup"
        @update:visible="() => (targetUserId = -1)"
      />
      <SharePopup v-model:visible="sharePopupVisible" />
    </nut-config-provider>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { IMatchItem } from '../../api/matching';
import QuestionCard from '../../components/questionCard/index.vue';
import AnswerCard from '../../components/answerCard/index.vue';
import CustomQuesCard from '../../components/CustomQuesCard/index.vue';
import { computed } from 'vue';
import { watch } from 'vue';
import { nextTick } from '@tarojs/taro';
import SharePopup from '../../biz-components/sharePopup/index.vue';
import SwitchWechatPopup from '../../biz-components/switchWechatPopup/index.vue';
import { useGlobalStore } from '../../store';
import Taro from '@tarojs/taro';

const props = defineProps<{
  showCustomCard: boolean;
  getActivityList: (data: {
    a_id: number;
    user_id: number;
    groups: string;
  }) => Promise<{
    data: {
      ad: IMatchItem[] | null;
      answer: IMatchItem[] | null;
      question: IMatchItem[] | null;
      issue: IMatchItem;
      group: number;
    };
  }>;
}>();

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
const global = useGlobalStore();
const idx = ref(-1);
const activeAnswers = computed(() =>
  activityList.value.filter((item) => item.cardType === 'answer'),
);
const activityList = ref<(IMatchItem & { cardType: string })[]>([]);
const prepareActivityList = ref<(IMatchItem & { cardType: string })[]>([]);
const takeEnoughShotDialog = ref(false);
const noShotDialog = ref(false);
const sharePopupVisible = ref(false);
const switchWechatVisible = ref(false);
const walkGroups = ref<number[]>([]);
const targetUserId = ref<number>(-1);
const userId = Taro.getStorageSync('USER_ID');

const shouldShowCustomCard = ref(getShouldShowCustomCard());

const onOpenSharePopup = () => {
  noShotDialog.value = false;
  sharePopupVisible.value = true;
};

const userShot = computed(() => global.userProfile?.shot || 0);
const activityId = computed(() => instance?.router?.params.activityId);

async function fetchData() {
  try {
    const res = await props.getActivityList({
      a_id: Number(activityId.value) || 2,
      groups: walkGroups.value.join(','),
      user_id: Number(Taro.getStorageSync('USER_ID')) || 0,
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
      originList.sort(() => Math.random() - 0.5);
      return originList.concat(customQuesList, [nextPage]);
    }
    return [];
  } catch (error) {
    return [];
  }
}
async function init() {
  const data = await fetchData();
  activityList.value = data;
  idx.value = 0;
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
const goChat = (userId) => {
  targetUserId.value = userId;
  switchWechatVisible.value = true;
};
const onConfirmGoChat = () => {
  takeEnoughShotDialog.value = false;
};
const onCancel = () => {
  takeEnoughShotDialog.value = false;
};
init();
watch(idx, async (v, oldV) => {
  // 当前数据量为满额时，划到倒数第三页的时候请求下一页数据
  const activeAnswerLength = activeAnswers.value.length;
  if (oldV > v) {
    return;
  }
  // 刷到第一条的时候就请求下一条
  if (v === 0) {
    if (activeAnswerLength) {
      prepareActivityList.value = await fetchData();
    }
    // 刷到最后一条有内容的数据的时候，并且有可替换的内容，准备替换内容
  } else if (
    v === activityList.value.length - 1 &&
    prepareActivityList.value.length > 1
  ) {
    // 跳转到下一页

    setTimeout(() => {
      activityList.value.splice(0, 6);
      idx.value = 0;
      nextTick(() => {
        activityList.value = prepareActivityList.value;
        prepareActivityList.value = [];
        idx.value = 0;
      });
    }, 300);
  }
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
.inline {
  display: inline;
}
</style>
