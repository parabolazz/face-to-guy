<template>
  <nut-config-provider theme="dark">
    <view class="home p-3.5">
      <!-- <virtual-list
        wclass="List"
        :height="500"
        :item-data="list"
        :item-count="list.length"
        :item-size="100"
        :item="MessageItem"
        width="100%"
      /> -->
      <h3 class="home-title mb-3.5">附近</h3>
      <nut-grid :gutter="12" class="home-topic" :column-num="3">
        <nut-grid-item class="home-topic__item home-topic__first-item">
          <div class="home-topic__item__city">{{ city }}</div>
          <div>还不知道，先摇人</div>
        </nut-grid-item>
        <nut-grid-item
          :class="['home-topic__item', `home-topic__item-${topics[0].color}`]"
          v-if="topics[0]"
        >
          <div class="home-topic__item__city">{{ city }}</div>

          <div v-for="t in topics[0].title?.split(' ')" :key="t">
            {{ t }}
          </div></nut-grid-item
        >
      </nut-grid>
      <nut-grid :gutter="12" class="home-topic mt-3" :column-num="3">
        <nut-grid-item
          :class="['home-topic__item', `home-topic__item-${topic.color}`]"
          v-for="topic in topics.slice(1, topics.length)"
          :key="topic.title"
        >
          <div class="home-topic__item__city">{{ city }}</div>
          <div v-for="t in topics[0].title?.split(' ')" :key="t">
            {{ t }}
          </div></nut-grid-item
        >
      </nut-grid>
      <view class="home-operation mt-4">
        <nut-button @click="onClick">去信息填写页</nut-button>
        <nut-button @click="goShare">去分享页面</nut-button>
        <nut-button @click="goMatchUserInfo">去匹配对象详情页面</nut-button>
        <nut-button @click="goLoginPage">去登录页面</nut-button>
        <nut-button @click="goChatsPage">去聊天页面</nut-button>
        <view class="flex">
          <LottieView />
        </view>
        <!-- <view class="home-operation__match-btn" @click="goShare">开始匹配</view> -->
      </view>
    </view>
  </nut-config-provider>
</template>

<script lang="ts">
import { reactive, ref, toRefs } from 'vue';
import MessageItem from '../chats/MessageItem.vue';

import Taro from '@tarojs/taro';
import LottieView from '../../components/lottieView/index.vue';
import { useGlobalStore } from '../../store';

function buildData(offset = 0) {
  return Array(100)
    .fill(0)
    .map((_, i) => i + offset);
}

export default {
  name: 'TestIndex',
  setup() {
    const list = ref(buildData());
    const global = useGlobalStore();

    const state = reactive({
      city: '深圳',
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
    const goMatchUserInfo = () => {
      Taro.navigateTo({
        url: '/pages/user/index',
      });
    };
    const goLoginPage = () => {
      Taro.navigateTo({
        url: '/pages/login/index',
      });
    };
    const goChatsPage = () => {
      global.setActiveTabIndex(1);
      Taro.switchTab({
        url: '/pages/chats/index',
      });
    };
    const topics = [
      {
        title: '夜宵局 摇一摇',
        color: 'DBF378',
      },
      {
        title: '撸铁局 摇一摇',
        color: 'CF83ED',
      },
      {
        title: '奶茶咖啡 摇一摇',
        color: '74D172',
      },
      {
        title: '压马路 摇一摇',
        color: '65BAE8',
      },
    ];

    return {
      ...toRefs(state),
      goShare,
      onClick,
      goMatchUserInfo,
      goLoginPage,
      goChatsPage,
      list,
      MessageItem,
      topics,
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
  margin-bottom: 80px;
  .home-title {
    font-size: 24px;
    font-weight: bold;
  }
  .home-operation {
    width: 100%;
    padding: 0 14px;
    color: rgb(136, 136, 136);
  }
  .home-topic {
    margin-left: -12px;
    margin-right: -12px;
    .home-topic__item {
      height: 162px;

      &.home-topic__item-DBF378 {
        .nut-grid-item__content {
          background-color: #dbf378;
        }
      }
      &.home-topic__item-CF83ED {
        .nut-grid-item__content {
          background-color: #cf83ed;
        }
      }
      &.home-topic__item-74D172 {
        .nut-grid-item__content {
          background-color: #74d172;
        }
      }
      &.home-topic__item-65BAE8 {
        .nut-grid-item__content {
          background-color: #65bae8;
        }
      }

      .nut-grid-item__content {
        border-radius: 10px;
        font-size: 20px;
        font-weight: bold;
        color: #000;
        border: none;
        position: relative;
        .home-topic__item__city {
          position: absolute;
          top: 14px;
          left: 14px;
          padding: 4px 8px;
          background-color: #000;
          border-radius: 20px;
          font-size: 10px;
          line-height: 10px;
          color: #fff;
        }
      }
    }

    .home-topic__first-item {
      flex-basis: 66.66% !important;
      .nut-grid-item__content {
        background-image: url(../../assets/images/pair_btn_bg.webp);
        color: #fff;
      }
    }
    .home-topic__item:not(.home-topic__first-item) {
      .nut-grid-item__content {
        padding-left: 14px;
        align-items: flex-start;
      }
    }
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
