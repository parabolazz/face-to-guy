<template>
  <nut-config-provider theme="dark">
    <view class="home">
      <div class="home-head">
        <h3 class="home-title">附近</h3>
        <div class="home-head__shot" @click="showShot">
          Shot: {{ shotCount }}杯
          <img :src="AddShot" class="home-head__add-shot" alt="add shot" />
        </div>
      </div>
      <nut-grid :gutter="12" class="home-topic" :column-num="3">
        <nut-grid-item
          @click="() => goMatching(topic.activityId)"
          :class="['home-topic__item', `home-topic__item-${topic.color}`]"
          v-for="topic in topics.slice(0, topics.length - 1)"
          :key="topic.title"
        >
          <div class="home-topic__item__city">{{ city }}</div>
          <div v-for="t in topic.title?.split(' ')" :key="t">
            {{ t }}
          </div></nut-grid-item
        >
      </nut-grid>
      <nut-grid :gutter="12" class="home-topic" :column-num="3">
        <!-- <nut-grid-item class="home-topic__item home-topic__first-item">
          <div class="home-topic__item__city">{{ city }}</div>
          <div>还不知道，先摇人</div>
        </nut-grid-item> -->
        <nut-grid-item
          :class="['home-topic__item', `home-topic__item-${topics[3].color}`]"
          @click="() => goMatching(topics[3].activityId)"
          v-if="topics[3]"
        >
          <div class="home-topic__item__city">{{ city }}</div>
          <div v-for="t in topics[3].title?.split(' ')" :key="t">
            {{ t }}
          </div>
        </nut-grid-item>
      </nut-grid>
      <SharePopup v-model:visible="isVisible" />
    </view>
  </nut-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Taro from '@tarojs/taro';
import { useGlobalStore } from '../../store';
import AddShot from '../../assets/images/shot_add.svg';
import SharePopup from '../../biz-components/sharePopup/index.vue';
import { computed } from 'vue';

console.log('SharePopup', SharePopup);

const global = useGlobalStore();
const isVisible = ref(false);

const shotCount = computed(() => global.userProfile?.shot || 0);
const city = ref('深圳');

// const onClick = () => {
//   Taro.navigateTo({
//     url: '/pages/profile/index',
//   });
// };
// const goShare = () => {
//   Taro.navigateTo({
//     url: '/pages/share/index',
//   });
// };
// const goMatchUserInfo = () => {
//   Taro.navigateTo({
//     url: '/pages/user/index',
//   });
// };
// const goLoginPage = () => {
//   Taro.navigateTo({
//     url: '/pages/login/index',
//   });
// };
// const goChatsPage = () => {
//   global.setActiveTabIndex(1);
//   Taro.switchTab({
//     url: '/pages/chats/index',
//   });
// };
// const goChatPage = () => {
//   Taro.navigateTo({
//     url: '/pages/chat/index',
//   });
// };
const showShot = () => {
  if (global.userProfile) {
    isVisible.value = true;
  } else {
    Taro.navigateTo({
      url: '/pages/login/index',
    });
  }
};
const topics = [
  {
    activityId: 1,
    title: '吃喝玩乐 摇一摇',
    color: 'DBF378',
  },
  {
    activityId: 2,
    title: '运动户外 摇一摇',
    color: 'CF83ED',
  },
  {
    activityId: 3,
    title: '旅游看世界',
    color: '74D172',
  },
  {
    activityId: 4,
    title: '一起上岸！',
    color: '65BAE8',
  },
];
const goMatching = (activityId: number) => {
  Taro.navigateTo({
    url: `/pages/matching/index?activityId=${activityId}`,
  });
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
  padding: 14px;
  .home-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .home-head__shot {
      display: flex;
      align-items: center;
      font-size: 12px;
    }
    .home-head__add-shot {
      margin-left: 4px;
      width: 14px;
      height: 14px;
    }
  }
  .home-title {
    margin-bottom: 14px;
    font-size: 22px;
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
    margin-bottom: 12px;
    .home-topic__item {
      height: 146px;

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
          top: 12px;
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
