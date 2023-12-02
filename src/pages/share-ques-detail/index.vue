<template>
  <div class="share-detail flex flex-column">
    <div v-if="nums > 0" class="share-detail__user-nums mb-2">
      <div class="flex items-center text-xs mb-2 font-bold">
        已有
        <span class="nums">{{ nums }}人</span>
        交换了该答案
      </div>
      <!-- some user circle avatar -->
      <scroll-view
        :scroll-x="true"
        class="whitespace-nowrap flex items-center share-detail__users-avatars"
      >
        <div
          v-for="(p, index) in users"
          :key="index"
          class="share-detail__user-avatar mr-3 inline-block relative"
        >
          <img
            :src="p.avatar"
            class="share-detail__user-avatar"
            mode="aspectFill"
          />
          <div v-if="p.isOwner" class="share-detail__user-avatar-tag">发起</div>
        </div>
      </scroll-view>
    </div>
    <CardList
      ref="cardListRef"
      class="flex-1"
      :randomCards="false"
      :showCustomCard="showCustomCard"
      :getValidCardLength="getValidCardLength"
      :getActivityList="getActivityList"
    >
      <template #item="{ data, index, currentIdx }">
        <QuestionCard
          v-bind="data"
          :userId="userId"
          tips="回答问题参与坦白局，解锁更多帅哥的回答"
          v-if="data.cardType === 'question'"
        >
          <template v-slot:extra>
            <div class="flex justify-between mb-6 transparent-desc-text">
              是否将该答案分享至公共频道:
              <nut-switch v-model="shareToPublic" />
            </div>
          </template>
          <template v-slot:btn="slotProps" v-if="!iAmOwner">
            <nut-button
              class="question-card__submit"
              type="primary"
              @click="onAnswer(slotProps.answer, data)"
              >回答问题，参与坦白局</nut-button
            >
          </template>
        </QuestionCard>
        <AnswerCard
          :isBlur="!hasAnswerThisQues && !iAmOwner"
          v-else-if="data.cardType === 'answer'"
          v-bind="data"
          :isActive="currentIdx === index"
          @goChat="goChat"
        >
          <template v-slot:btn>
            <nut-button
              v-show="!iAmOwner"
              class="answer-card__btn"
              type="primary"
              @click="cardListRef.changeIndex(0)"
              >回答问题，参与坦白局
            </nut-button>
          </template>
        </AnswerCard>
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
<script lang="ts" setup>
import Taro, { useDidShow } from '@tarojs/taro';
import CardList from '../../components/cardList/index.vue';
import { ref } from 'vue';
import QuestionCard from '../../components/questionCard/index.vue';
import AnswerCard from '../../components/answerCard/index.vue';
import { computed } from 'vue';
import SharePopup from '../../biz-components/sharePopup/index.vue';
import SwitchWechatPopup from '../../biz-components/switchWechatPopup/index.vue';
import { useGlobalStore } from '../../store';
import { getShareQuesDetail } from '../../api/matching';
import useAnswer from '../create-question/utils/useAnswer';

defineProps<{
  showCustomCard: boolean;
}>();
const instance = Taro.getCurrentInstance();
const hasAnswerThisQues = ref(false);
const nums = ref(1);
const questionText = ref('');
const cardListRef = ref();
const global = useGlobalStore();
const shareId = instance.router?.params?.shareId;
const takeEnoughShotDialog = ref(false);
const noShotDialog = ref(false);
const sharePopupVisible = ref(false);
const switchWechatVisible = ref(false);
const targetUserId = ref<number>(-1);
const userId = ref(Taro.getStorageSync('USER_ID'));
const shareToPublic = ref(true);
const iAmOwner = ref(false);
const users = ref<
  {
    avatar: string;
    isOwner: boolean;
  }[]
>([]);

const { onCreateQuestion } = useAnswer(questionText, userId);

const onOpenSharePopup = () => {
  noShotDialog.value = false;
  sharePopupVisible.value = true;
};
const getActivityList = async (params) => {
  const res = await getShareQuesDetail({
    page_num: params.page_num,
    user_id: params.user_id,
    share_id: shareId || '',
    page_size: 20,
  });
  if (res) {
    const { data } = res;
    const { list, total, quest } = data;
    const hasRes = list && list.length > 0;
    questionText.value = quest.title;
    nums.value = total;
    // 拿第一页的数据当做用户数据展示
    if (params.page_num === 1) {
      users.value = list.map((item) => ({
        avatar: item.avatar,
        isOwner: item.user_id === quest.user_id,
      }));
      // 如果是自己发起的问题，不显示问题卡和模糊
      if (userId.value && userId.value === quest.user_id) {
        iAmOwner.value = true;
      }
    }
    const answerList = list.map((item) => ({
      ...item,
      type: quest.type,
      title: quest.title,
      avatar_id: item.avatar,
    }));
    return {
      data: {
        question: hasRes && !iAmOwner.value ? [quest] : [],
        answer: answerList || [],
      },
    };
  }
};

const getValidCardLength = (list: { cardType: string }[]) =>
  list.filter((item) => item.cardType === 'answer');
const userShot = computed(() => global.userProfile?.shot || 0);

const onAnswer = async (answer: string, info: any) => {
  if (!userId.value) {
    Taro.navigateTo({
      url: '/pages/login/index',
    });
  }
  if (!answer) {
    Taro.showToast({
      title: '请先回答问题哦！',
      icon: 'none',
    });
    return;
  }
  try {
    await onCreateQuestion({
      answer,
      question: questionText.value,
      type: info.type,
      userId: userId.value,
      activity_id: info.activity_id,
      originalShareId: info.share_id,
    });
    hasAnswerThisQues.value = true;
  } catch (error) {}
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

useDidShow(() => {
  const _userId = Taro.getStorageSync('USER_ID');
  // 未登录登录后回来
  if (!userId.value && _userId) {
    userId.value = _userId;
    cardListRef.value?.init();
  }
});
</script>
<style lang="scss">
.share-detail {
  height: 100%;
  padding: 12px 12px 0 12px;
  .share-detail__switch {
    margin: 20px 0 14px 0;
  }
  .share-detail__user-nums {
    padding: 12px 0 12px 12px;
    border-radius: 9px;
    background-color: #232323;
  }
  .share-detail__users-avatars {
    height: 44px;
  }
  .share-detail__user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .share-detail__user-avatar-tag {
    position: absolute;
    top: 0;
    right: -5px;
    padding: 1.5px 4px;
    border-radius: 27px;
    background-color: #dbf378;
    color: #000;
    font-size: 6px;
  }
  .question-card {
    background-color: #67a4ff;
    .question-card__tag {
      background-color: #4d94ff;
    }
  }
  .nums {
    color: #dbf378;
    margin: 0px 2px;
  }
  .matching-swiper {
    height: 600px;
    .matching-swiper__card {
      height: 580px !important;
      .matching-swiper__card-content {
        height: 570px;
      }
    }
  }
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
