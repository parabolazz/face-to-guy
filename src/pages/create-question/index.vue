<template>
  <div id="create-question">
    <nut-config-provider theme="dark" class="full-height create-question">
      <nut-tabs v-model="currentTab">
        <nut-tab-pane title="系统问题库">
          <SysQuestionList
            :userId="userId"
            @onAnswer="onAnswer"
            @changeTitle="(title) => (question = title)"
          />
        </nut-tab-pane>
        <nut-tab-pane title="自定义问题">
          <div class="create-question__custom">
            <CreateQuestionCard
              :userId="userId"
              @onAnswer="onAnswer"
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
        ok-text="分享到群聊"
        @ok="dialogVisible = true"
      >
        <div style="position: relative; width: 100%">
          <img
            style="width: 100%"
            mode="widthFix"
            :src="inviteShare"
            alt="invite share"
          />
          <div
            style="left: 34%; top: 13.36%"
            class="create-question__share-dialog-tips"
          >
            坦白局，敢接招吗？
          </div>
          <div
            style="left: 39.5%; bottom: 23%"
            class="create-question__share-dialog-tips"
          >
            你的回答？
          </div>
          <div
            class="create-question__share-dialog-tips"
            style="left: 11%; top: 31.46%; width: 65%"
          >
            Q: {{ question }}
          </div>
        </div>
        <template #footer>
          <nut-button
            type="primary"
            style="color: #000"
            size="small"
            open-type="share"
            @click="onClickShare"
          >
            分享到群聊
          </nut-button>
        </template>
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
import inviteShare from '../../assets/images/invite_share.jpg';

const currentTab = ref('0');
const userId = Taro.getStorageSync('USER_ID');
const question = ref('');
const { onCreateQuestion } = useAnswer(question, userId);
const dialogVisible = ref(false);
const shareIdString = ref('');

const onAnswer = async ({
  answer,
  title,
  type,
  activity_id,
}: {
  answer: string;
  title: string;
  type: 1 | 2;
  activity_id?: number;
}) => {
  question.value = title;
  try {
    const shareId = await onCreateQuestion({
      answer,
      question: title,
      type,
      userId,
      activity_id,
    });
    shareIdString.value = shareId;
    dialogVisible.value = true;
  } catch (error) {
    //
    debugger;
  }
};

const onClickShare = () => {
  dialogVisible.value = false;
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
    top: 0;
    transform: translate(-50%, 0);
    .nut-dialog {
      width: 100%;
      background-color: #000;
      padding: 20px 10px 16px 10px;
    }
    .nut-dialog__content {
      margin-top: 0;
      max-height: auto;
      overflow: hidden;
    }
    .create-question__share-dialog-tips {
      position: absolute;
      font-weight: bold;
      font-size: 17px;
      color: #000;
      line-height: 1.4;
      text-align: left;
    }
  }
}
</style>
