<template>
  <div>
    <CardList
      ref="cardListRef"
      :showCustomCard="showCustomCard"
      :getValidCardLength="getValidCardLength"
      :getActivityList="getActivityList"
    >
      <template #item="{ data, index, currentIdx }">
        <QuestionCard
          v-if="data.cardType === 'question'"
          :userId="userId"
          :title="data.title"
          :type="data.type"
          :id="data.id"
          @onAnswer="onAnswer"
        />
        <AnswerCard
          v-else-if="data.cardType === 'answer'"
          v-bind="data"
          :isActive="currentIdx === index"
          @goChat="goChat"
        ></AnswerCard>
        <CustomQuesCard
          v-else-if="data.cardType === 'customQuestion'"
          :userId="userId"
          @onAnswer="onAnswer"
        ></CustomQuesCard>
      </template>
    </CardList>

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
import CardList from '../../components/cardList/index.vue';
import QuestionCard from '../../components/questionCard/index.vue';
import AnswerCard from '../../components/answerCard/index.vue';
import CustomQuesCard from '../../components/CustomQuesCard/index.vue';
import { computed } from 'vue';
import SharePopup from '../../biz-components/sharePopup/index.vue';
import SwitchWechatPopup from '../../biz-components/switchWechatPopup/index.vue';
import { useGlobalStore } from '../../store';
import Taro from '@tarojs/taro';

defineProps<{
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

const cardListRef = ref();
const global = useGlobalStore();
const activityList = ref<(IMatchItem & { cardType: string })[]>([]);
const takeEnoughShotDialog = ref(false);
const noShotDialog = ref(false);
const sharePopupVisible = ref(false);
const switchWechatVisible = ref(false);
const targetUserId = ref<number>(-1);
const userId = Taro.getStorageSync('USER_ID');

const onOpenSharePopup = () => {
  noShotDialog.value = false;
  sharePopupVisible.value = true;
};

// FIXME yihuang
const getValidCardLength = () => true;
const userShot = computed(() => global.userProfile?.shot || 0);

const onAnswer = () => {
  const currentIdx = cardListRef.value.idx.value;
  if (currentIdx < activityList.value.length - 1) {
    cardListRef.value.changeIndex(currentIdx + 1);
  } else {
    cardListRef.value.fetchData();
    cardListRef.value.idx.value = 0;
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
</script>
<style lang="scss">
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
