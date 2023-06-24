<template>
  <nut-config-provider theme="light">
    <div class="answer-card">
      <span class="answer-card__head">答案卡</span>
      <div class="answer-card__main">
        <div class="answer-card__user-info">
          <div class="answer-card__user-info-image">
            <img
              class="answer-card__user-info-avatar"
              :src="userInfo.avatar_ids[0]"
              alt="avatar"
            />
          </div>
          <div class="answer-card__user-info-text">
            <div class="answer-card__user-info-name">
              {{ userInfo.nickname }}
            </div>
            <div class="answer-card__user-info-desc">{{ desc }}</div>
          </div>
        </div>
        <div class="answer-card__main-ques">Q: {{ title }}</div>
        <div class="answer-card__main-answer" :style="{ height: width + 'px' }">
          <img
            v-if="type === 'image'"
            :src="answer"
            alt="answer"
            style="width: 100%; height: 100%"
          />
          <scroll-view
            :scroll-y="true"
            style="height: 100%; width: 100%"
            class="answer-card__main-answer-text"
          >
            {{ answer }}
          </scroll-view>
        </div>
      </div>
      <div class="answer-card__footer"></div>
    </div>
  </nut-config-provider>
</template>
<script lang="ts" setup>
import { ProfileData } from 'src/api/user';
import { computed, ref } from 'vue';
import { Attributes, Shape } from './user';
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro';
import { onMounted } from 'vue';

const query = Taro.createSelectorQuery();
const props = defineProps<{
  type: 'text' | 'image';
  title: string;
  answer: string;
}>();

const userInfo = ref<ProfileData>({
  nickname: '张三',
  avatar_ids: ['https://img.yzcdn.cn/vant/cat.jpeg'],
  attribute: 0,
  height: 180,
  weight: 60,
  shape: 1,
});
const width = ref(0);

const desc = computed(() => {
  const { attribute, height, weight, shape } = userInfo.value;
  const attrText = Attributes[attribute];
  const shapeText = Shape[shape];
  const descArr = [
    attrText,
    height ? height + 'cm' : undefined,
    weight ? weight + 'kg' : undefined,
    shapeText,
  ];
  return descArr.filter((item) => item).join(' / ');
});

onMounted(() => {
  eventCenter.once(getCurrentInstance().router!.onReady, () => {
    const query = Taro.createSelectorQuery();

    query.select('.answer-card__main-ques').boundingClientRect();
    query.exec((res) => {
      const firstDom = res[0];
      if (firstDom) {
        width.value = firstDom.width;
      }
    });
  });
});
</script>
<style lang="scss">
.answer-card {
  width: 100%;
  background: #6967ff;
  border-radius: 9px;
  padding: 12px 12px 36px;
  color: #fff;
  .answer-card__head {
    display: inline-block;
    padding: 7px 12px;
    border-radius: 30px;
    background-color: #000;
    color: #fff;
    font-size: 14px;
    margin-bottom: 12px;
  }
  .answer-card__user-info {
    display: flex;
    align-items: center;
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
}
</style>