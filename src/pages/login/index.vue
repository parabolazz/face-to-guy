<template>
  <view class="login">
    <div class="login-main">
      <div class="login-main__vision">
        <img class="login-main__logo" :src="LogoImage" alt="" />
      </div>
      <nut-button
        type="primary"
        v-if="!hasAgreed"
        class="login-btn"
        @click="triggerToast"
        >一键快捷登录</nut-button
      >
      <nut-button
        v-else
        type="primary"
        class="login-btn"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
        >一键快捷登录</nut-button
      >
      <p class="login-btn-tips">没有账号则直接注册</p>
    </div>
    <div class="login-footer">
      <nut-radio-group v-model="hasAgreed" direction="horizontal">
        <nut-radio label="1">
          <div class="flex">
            同意
            <div style="color: #3370ff" @click="onViewUserTerms">
              《用户服务协议》
            </div>
            和
            <div style="color: #3370ff" @click="onViewPrivacy">
              《隐私保护协议》
            </div>
          </div>
        </nut-radio>
      </nut-radio-group>
    </div>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { ref } from 'vue';
import { login } from '../../api/user';
import LogoImage from '../../assets/images/logo.png';
import { useGlobalStore } from '../../store';
const hasAgreed = ref(false);

const global = useGlobalStore();
const triggerToast = () => {
  Taro.showToast({
    title: '请先同意下方的用户协议',
    icon: 'none',
  });
};

const getPhoneNumber = async (e: any) => {
  if (e.detail.code) {
    console.log('phone number code', e.detail.code);
    try {
      const res = await login({
        code: e.detail.code,
      });
      Taro.showToast({
        title: '登录成功',
        icon: 'none',
      });
      Taro.setStorageSync('TOKEN', res?.data.token);
      Taro.setStorageSync('USER_ID', res?.data.user_id);
      global.getUserProfile();
      global.fetchIfMsgRead();
      //跳转到信息填写页
      res?.data.is_new
        ? Taro.navigateTo({
            url: '/pages/profile/index',
          })
        : Taro.navigateBack();
    } catch (error) {
      console.log('login error', error);
    }
  } else {
    Taro.showToast({
      title: '获取手机号失败',
      icon: 'none',
    });
  }
};

const onViewUserTerms = (e) => {
  e.stopPropagation();
  Taro.navigateTo({
    url: '/pages/terms/index?noLogin=1',
  });
};

const onViewPrivacy = (e) => {
  e.stopPropagation();
  Taro.navigateTo({
    url: '/pages/privacy/index?noLogin=1',
  });
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
    margin-top: 90px;
    .login-main__vision {
      display: flex;
      justify-content: center;
      margin-bottom: 150px;
      .login-main__logo {
        width: 190px;
        height: 62px;
      }
    }
    .login-btn {
      margin-bottom: 10px;
    }
    .login-btn-tips {
      font-size: 14px;
    }
  }
}
</style>
