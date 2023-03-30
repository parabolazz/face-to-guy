<template>
  <view class="index">
    <nut-grid :column-num="3">
      <nut-grid-item text="文字"><Dongdong /></nut-grid-item>
      <nut-grid-item text="文字"><Dongdong /></nut-grid-item>
      <nut-grid-item text="文字"><Dongdong /></nut-grid-item>
    </nut-grid>
    {{ msg }} <Dongdong />
    <view class="btn">
      <nut-button type="primary" @click="handleClick('text', msg2, true)"
        >点你</nut-button
      >
    </view>
    <nut-toast :msg="msg2" v-model:visible="show" :type="type" :cover="cover" />
  </view>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
import { Dongdong } from '@nutui/icons-vue-taro';
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

    return {
      ...toRefs(state),
      handleClick,
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
