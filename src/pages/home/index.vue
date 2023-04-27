<template>
  <view class="home">
    <view class="home-operation">
      <nut-button @click="onClick">去信息填写页</nut-button>
      <view class="flex">
        <text class="home-operation__countdown-tip">距离 Party 结束还剩 </text>
        <Countdown :end="end" />
      </view>
      <view class="home-operation__match-btn" @click="goShare">开始匹配</view>
    </view>
  </view>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
import Taro from '@tarojs/taro';
import Countdown from '../../components/countdown/index.vue';

export default {
  name: 'TestIndex',
  components: { Countdown },
  setup() {
    const state = reactive({
      end: Date.now() + 60 * 1000,
    });
    const onClick = () => {
      Taro.navigateTo({
        url: '/pages/profile/index',
      });
    };
    const goShare = () => {
      Taro.navigateTo({
        url: '/pages/share/index',
      });
    };

    return {
      ...toRefs(state),
      goShare,
      onClick,
    };
  },
};
</script>

<style lang="scss">
.flex {
  display: flex;
  flex-direction: row;
}
.home {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  // margin-bottom: 80px;
  .home-operation {
    position: absolute;
    bottom: 80px;
    left: 0;
    width: 100%;
    padding: 0 14px;
    color: rgb(136, 136, 136);
  }

  .home-operation__countdown-tip {
    font-size: 16px;
    margin-right: 13px;
  }
  .home-operation__match-btn {
    margin: 14px 0 24px;
    padding: 19px 10px;
    background-color: #dbf378;
    font-size: 20px;
    text-align: center;
    font-weight: 500;
    color: #000;
    border-radius: 10px;
  }
}
</style>
