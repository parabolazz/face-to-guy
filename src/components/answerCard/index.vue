<template>
  <div class="answer-card">
    <nut-config-provider theme="light">
      <span class="answer-card__head">答案卡</span>
      <div class="answer-card__main">
        <div class="answer-card__user-info">
          <div class="answer-card__user-info-image">
            <img
              class="answer-card__user-info-avatar"
              :src="avatar_id"
              alt="avatar"
            />
          </div>
          <div class="answer-card__user-info-text">
            <div class="answer-card__user-info-name">
              {{ nickname }}
            </div>
            <div class="answer-card__user-info-desc">{{ desc }}</div>
          </div>
          <nut-button
            class="answer-card__user-info-btn"
            type="primary"
            plain
            @click="goToViewUser"
            >看主页</nut-button
          >
        </div>
        <div class="answer-card__main-ques">Q: {{ title }}</div>
        <div class="answer-card__main-answer" :style="{ height: width + 'px' }">
          <img
            v-if="type === 2"
            :src="answer"
            alt="answer"
            style="width: 100%; height: 100%"
          />
          <scroll-view
            v-else
            :scroll-y="true"
            :enable-flex="true"
            style="
              height: 100%;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            "
            class="answer-card__main-answer-text"
          >
            {{ answer }}
          </scroll-view>
        </div>
      </div>
      <div class="answer-card__footer">
        <nut-button type="primary" class="answer-card__btn" @click="goChat"
          >打招呼</nut-button
        >
      </div>
    </nut-config-provider>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Attributes, Shape } from './user';
import Taro from '@tarojs/taro';
import { watch } from 'vue';
import { IAnswer } from 'src/api/matching';

const props = defineProps<IAnswer & { isActive: boolean }>();
const width = ref(0);
const desc = computed(() => {
  const { attribute, height, weight, shape } = props;
  // @ts-ignore
  const attrText = Attributes[`${attribute}`];
  // @ts-ignore
  const shapeText = Shape[`${shape}`];
  const descArr = [
    attrText,
    height ? height + 'cm' : undefined,
    weight ? weight + 'kg' : undefined,
    shapeText,
  ];
  return descArr.filter((item) => item).join(' / ');
});

const emit = defineEmits<{
  (e: 'goChat', value: number): void;
}>();

const goChat = () => {
  emit('goChat', props.user_id);
};

const goToViewUser = () => {
  Taro.navigateTo({
    url: `/pages/user/index?userId=${props.user_id}`,
  });
};

watch(
  () => props.isActive,
  (isActive) => {
    if (isActive) {
      const query = Taro.createSelectorQuery();

      query.select('.answer-card__main-ques').boundingClientRect();
      query.exec((res) => {
        const firstDom = res[0];
        if (firstDom) {
          width.value = firstDom.width;
        }
      });
    }
  },
);
</script>
<style lang="scss">
.answer-card {
  width: 100%;
  height: 100%;
  flex: 1;
  background: #6967ff;
  border-radius: 9px;
  padding: 12px 12px 36px;
  color: #fff;
  .answer-card__head {
    display: inline-block;
    padding: 7px 12px;
    border-radius: 30px;
    background-color: #4f4dff;
    color: #fff;
    font-size: 14px;
    margin-bottom: 12px;
  }
  .answer-card__user-info {
    display: flex;
    align-items: center;
  }
  .answer-card__user-info-text {
    flex: 1;
  }
  .answer-card__user-info-btn {
    padding: 8px 16px;
    border-radius: 10px;
    background-color: transparent !important;
    font-weight: bold;
    border-width: 2px;
  }
  .answer-card__user-info-avatar {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .answer-card__user-info-name {
    font-size: 18px;
    line-height: 24px;
    font-weight: bold;
    margin-bottom: 2px;
  }
  .answer-card__user-info-desc {
    font-size: 12px;
    line-height: 18px;
  }
  .answer-card__main-ques {
    position: relative;
    margin-top: 25px;
    padding: 12px;
    font-size: 14px;
    font-weight: bold;
    background-color: #000;
    border-radius: 9px 9px 0 0;
    &::before {
      display: block;
      content: '';
      position: absolute;
      top: -14px;
      left: 20px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 15px 15px 15px;
      border-color: transparent transparent #000 transparent;
    }
  }
  .answer-card__main-answer {
    background-color: #fff;
    border-radius: 0 0 9px 9px;
    overflow: hidden;
  }
  .answer-card__main-answer-text {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 25px;
    height: 100%;
    word-break: break-word;
    padding: 12px;
  }
  .answer-card__btn {
    margin-top: 16px;
    width: 100%;
    padding: 12px 0;
    color: #000;
    font-weight: bold;
    border-radius: 9px;
  }
}
</style>
