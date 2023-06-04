<template>
  <view class="login">
    <div class="login-header"></div>
    <div class="login-main">
      <nut-button
        type="primary"
        v-if="!hasAgreed"
        class="login-btn"
        @click="triggerToast"
        >微信快捷登录</nut-button
      >
      <nut-button
        v-else
        type="primary"
        class="login-btn"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
        >微信快捷登录</nut-button
      >
      <p class="login-btn-tips">没有账号则直接注册</p>
    </div>
    <div class="login-footer">
      <nut-radio-group v-model="hasAgreed" direction="horizontal">
        <nut-radio label="1">同意《用户服务协议》和《隐私保护协议》</nut-radio>
      </nut-radio-group>
    </div>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { ref } from 'vue';
import { login } from '../api/user';
const hasAgreed = ref(false);

const triggerToast = () => {
  Taro.showToast({
    title: '请先同意下方的用户协议',
    icon: 'none',
  });
};
// const themeVars = {
//   primaryColor: '#dbf378',
// };

const getPhoneNumber = async (e: any) => {
  if (e.detail.code) {
    Taro.showToast({
      title: '获取手机号成功',
      icon: 'none',
    });
    console.log(e.detail.code);

    try {
      const res = await login({
        code: e.detail.code,
      });
      console.log('res', res);
    } catch (error) {
      console.log('error', error);
    }
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
</script>

<style lang="scss">
.login {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 20px 4px env(safe-area-inset-bottom);
  .login-footer {
    text-align: center;
    .nut-radio__label {
      color: #fff;
    }
  }
  .login-btn {
    height: 62px;
    width: calc(100% - 92px);
    border-radius: 10px;
    // background: #dbf378;
    color: #000;
    font-size: 20px;
    font-weight: 500;
  }
  .login-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .login-btn {
      margin-bottom: 10px;
    }
    .login-btn-tips {
      font-size: 14px;
    }
  }
}
</style>
