<template>
  <div id="create-question">
    <nut-config-provider theme="dark" class="full-height create-question">
      <nut-tabs v-model="currentTab">
        <nut-tab-pane title="系统问题库">
          <SysQuestionList
            ref="sysQuestionListRef"
            :userId="userId"
            @onAnswer="(params) => onAnswer({ ...params, from: 'system' })"
            @changeTitle="(title) => (question = title)"
          />
        </nut-tab-pane>
        <nut-tab-pane title="自定义问题">
          <div class="create-question__custom">
            <CreateQuestionCard
              :userId="userId"
              @onAnswer="(params) => onAnswer({ ...params, from: 'custom' })"
              @changeTitle="(title) => (question = title)"
            />
          </div>
        </nut-tab-pane>
      </nut-tabs>
      <nut-dialog
        teleport="#create-question"
        pop-class="create-question__share-dialog"
        :close-on-click-overlay="false"
        v-model:visible="dialogVisible"
        no-cancel-btn
        no-ok-btn
        @ok="dialogVisible = true"
      >
        <div>
          <div style="position: relative; width: 100%">
            <img
              style="width: 100%"
              mode="widthFix"
              :src="inviteShare"
              alt="invite share"
            />
            <div
              style="left: 34%; top: 5.5%"
              class="create-question__share-dialog-tips"
            >
              坦白局，敢接招吗？
            </div>
            <div
              style="left: 39%; top: 46%"
              class="create-question__share-dialog-tips"
            >
              你的回答？
            </div>
            <div
              class="create-question__share-dialog-tips main"
              style="left: 7%; top: 15.7%; width: 65%; height: 24.3%"
              :style="{
                'font-size': question.length > 30 ? '14px' : '20px',
              }"
            >
              <text style="width: 100%; line-break: anywhere">
                Q: {{ question }}
              </text>
            </div>
          </div>
          <div style="padding: 0 24px">
            <nut-button
              type="primary"
              class="create-question__share-dialog-submit"
              size="large"
              open-type="share"
              @click="onClickShare"
            >
              分享到群聊
            </nut-button>
          </div>
        </div>
      </nut-dialog>
    </nut-config-provider>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import CreateQuestionCard from '../../components/createQuestionCard/index.vue';
import SysQuestionList from './SysQuestionList.vue';
import useAnswer from './utils/useAnswer';
import Taro from '@tarojs/taro';
import inviteShare from '../../assets/images/invite_share.png';

const currentTab = ref('0');
const userId = ref(Taro.getStorageSync('USER_ID'));
const question = ref('');
const { onCreateQuestion } = useAnswer(question, userId);
const dialogVisible = ref(false);
const shareIdString = ref('');
const quesFrom = ref('');
const sysQuestionListRef = ref();

const onAnswer = async ({
  answer,
  title,
  type,
  activity_id,
  from,
}: {
  answer: string;
  title: string;
  type: 1 | 2;
  activity_id?: number;
  from: 'system' | 'custom';
}) => {
  question.value = title;
  quesFrom.value = from;
  try {
    const shareId = await onCreateQuestion({
      answer,
      question: title,
      type,
      userId: userId.value,
      activity_id,
    });
    shareIdString.value = shareId;
    dialogVisible.value = true;
  } catch (error) {
    //
  }
};

const onClickShare = () => {
  dialogVisible.value = false;
  if (quesFrom.value === 'system') {
    sysQuestionListRef.value.refreshList();
  }
  setTimeout(() => {
    Taro.navigateTo({
      url: `/pages/share-ques-detail/index?shareId=${shareIdString.value}`,
    });
  }, 3000);
};

watch(
  () => currentTab.value,
  () => {
    question.value = '';
  },
);
</script>
<style lang="scss">
#create-question {
  position: relative;
}
.create-question {
  display: flex;
  flex-direction: column;
  .nut-tabs,
  .nut-tabs__content {
    flex-grow: 1;
  }
  .create-question__custom {
    height: 100%;
  }
  .create-question__share-dialog {
    width: 100%;
    height: 100%;
    top: 0;
    transform: translate(-50%, 0);
    .nut-dialog {
      width: 100%;
      height: 100%;
      background-color: #000;
      padding: 0 0 16px 0;
    }
    .nut-dialog__content {
      height: 100%;
      margin-top: 0;
      max-height: 600px;
      overflow: hidden;
    }
    .create-question__share-dialog-tips {
      position: absolute;
      font-weight: 900;
      font-size: 17px;
      color: #000;
      line-height: 1.4;
      text-align: left;
      &.main {
        display: flex;
        align-items: center;
        padding-left: 12px;
      }
    }

    .create-question__share-dialog-submit {
      margin-top: 10px;
      border-radius: 10px;
      font-size: 18px;
      font-weight: bold;
      color: #000;
    }
  }
}
</style>
