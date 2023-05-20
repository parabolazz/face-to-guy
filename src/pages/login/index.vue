<template>
  <view class="index">
    <nut-button
      type="primary"
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
      >获取手机号</nut-button
    >
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';

const getPhoneNumber = async (e: any) => {
  console.log('code', e.detail.code);
  if (e.detail.code) {
    Taro.showToast({
      title: '获取手机号成功',
      icon: 'none',
    });
    // try {
    //   const res = await Taro.login();
    //   console.log('login res', res);
    // } catch (error) {
    //   console.log('login error', error);
    // }
  } else {
    Taro.showToast({
      title: '获取手机号失败',
      icon: 'none',
    });
  }
};
// import { reactive, toRefs } from 'vue';
// export default {
//   name: 'LoginIndex',
//   components: {},
//   setup() {
//     const state = reactive({
//       msg: '欢迎使用 NutUI4.0 开发小程序111',
//       msg2: '你成功了！！～',
//       type: 'text',
//       show: false,
//       cover: false,
//     });

//     const handleClick = (type, msg, cover = false) => {
//       state.show = true;
//       state.msg2 = msg;
//       state.type = type;
//       state.cover = cover;
//     };

//     return {
//       ...toRefs(state),
//       handleClick,
//     };
//   },
// };
</script>

<style lang="scss">
.index {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
