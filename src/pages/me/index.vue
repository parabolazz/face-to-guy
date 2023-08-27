<template>
  <view class="me">
    <nut-config-provider theme="dark">
      <div class="me-card">
        <div class="me-card__main">
          <img
            class="me-card__avatar"
            mode="aspectFill"
            :src="profile?.avatar_ids[0]"
            alt="avatar"
          />
          <div class="me-card__info">
            <div class="me-card__info-name" v-if="profile">
              {{ profile?.nickname }}
            </div>
            <div class="me-card__info-name" v-else @click="goToLogin">
              未登录用户
            </div>
            <div class="me-card__info-desc">{{ desc }}</div>
          </div>
        </div>

        <nut-grid
          class="me-card__operations"
          :column-num="2"
          :gutter="8"
          :border="false"
          v-if="profile"
        >
          <nut-grid-item class="me-card__operation">
            <nut-button
              class="me-card__operations_btn default"
              plain
              @click="goToMyUserPage"
              >查看我的主页</nut-button
            ></nut-grid-item
          >
          <nut-grid-item class="me-card__operation">
            <nut-button
              class="me-card__operations_btn"
              plain
              type="primary"
              @click="goToProfile"
              >编辑资料</nut-button
            ></nut-grid-item
          >
        </nut-grid>
      </div>
      <div class="me-menu">
        <nut-cell-group class="me-menu__group">
          <!-- <nut-cell round-radius="0" title="关于我们">
            <template #link>
              <RectRight color="#fff" />
            </template>
          </nut-cell>
          <nut-cell round-radius="0" title="设置">
            <template #link>
              <RectRight color="#fff" />
            </template>
          </nut-cell>
          <nut-cell round-radius="0" title="帮助和反馈">
            <template #link>
              <RectRight color="#fff" />
            </template>
          </nut-cell> -->
          <nut-cell
            v-if="profile"
            round-radius="0"
            title="退出登录"
            @click="onLogout"
          >
          </nut-cell>
          <nut-cell v-else round-radius="0" title="登录" @click="goToLogin">
          </nut-cell>
        </nut-cell-group>
      </div>
    </nut-config-provider>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
// import { RectRight } from '@nutui/icons-vue-taro';
import Taro from '@tarojs/taro';
import { useGlobalStore } from '../../store';
import { Attribute, Shape } from '../../utils/profileEnum';

const global = useGlobalStore();

const profile = computed(() => global.userProfile);

const desc = computed(() => {
  if (!profile.value) return '';
  const { attribute, height, weight, shape } = profile.value;
  const descArr = [
    Attribute[attribute],
    height,
    weight,
    Shape[shape as Shape],
  ].filter((item) => !!item);
  return descArr.join('/');
});

const goToLogin = () => {
  Taro.navigateTo({
    url: '/pages/login/index',
  });
};

const goToProfile = () => {
  Taro.navigateTo({
    url: '/pages/profile/index?from=me',
  });
};

const goToMyUserPage = () => {
  Taro.navigateTo({
    url: `/pages/user/index?userId=${Taro.getStorageSync('USER_ID')}`,
  });
};

const onLogout = () => {
  Taro.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: function (res) {
      if (res.confirm) {
        Taro.removeStorage({ key: 'TOKEN' });
        Taro.removeStorage({ key: 'USER_ID' });
        global.setUserProfile(null);
        global.setActiveTabIndex(0);
        global.setUnReadCount(0);
        Taro.switchTab({
          url: '/pages/home/index',
        });
      }
    },
  });
};
</script>

<style lang="scss">
.me {
  background-color: #141414;
  height: 100%;
  .me-card {
    display: flex;
    flex-direction: column;
    padding: 20px 14px 30px;
    margin-bottom: 14px;
    background-color: #000;
    .me-card__main {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
    }
    .me-card__avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background-color: #eee;
      margin-right: 16px;
    }
    .me-card__info {
      .me-card__info-name {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 6px;
        color: #fff;
      }
      .me-card__info-desc {
        font-size: 16px;
      }
    }
    .me-card__operations {
      .nut-grid-item__content {
        padding: 0;
        background-color: transparent;
      }
      .me-card__operations_btn {
        width: 100%;
        padding: 12px 20px;
        height: 42px;
        font-size: 16px;
        background-color: transparent;
        border-radius: 10px;
        &.default {
          border-color: #999999;
          color: #999999;
        }
      }
    }
  }
  .me-menu {
    .nut-cell {
      background-color: #000;
      padding: 20px 14px;
    }
    .nut-cell-group .nut-cell::after {
      border-bottom: none;
    }
    .nut-cell-group__wrap {
      border-radius: 0px;
    }
  }
}
</style>
