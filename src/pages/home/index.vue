<template>
  <view class="index">
    {{ msg }} <Dongdong />
    <view class="btn">
      <nut-button type="primary" @click="onClick">点你</nut-button>
    </view>
    <nut-toast :msg="msg2" v-model:visible="show" :type="type" :cover="cover" />
  </view>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
import { Dongdong } from '@nutui/icons-vue-taro';
import Taro from '@tarojs/taro';
export default {
  name: 'TestIndex',
  components: {
    Dongdong,
  },
  setup() {
    const state = reactive({
      msg: '欢迎使用 NutUI4.0 开发小程序123456789',
      msg2: '你成功了！！～',
      type: 'text',
      show: false,
      cover: false,
    });

    const handleClick = (type, msg, cover = false) => {
      state.show = true;
      state.msg2 = msg;
      state.type = type;
      state.cover = cover;
    };
    const onClick = () => {
      Taro.navigateTo({
        url: '/pages/profile/index',
      });
    };

    return {
      ...toRefs(state),
      handleClick,
      onClick,
    };
  },
};
</script>

<style lang="scss">
.index {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
