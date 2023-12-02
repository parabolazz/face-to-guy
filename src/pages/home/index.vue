<template>
  <nut-config-provider theme="dark">
    <view class="home">
      <nut-button @click="onTest">你好啊</nut-button>
      <div class="home-invite-btn" @click="goToCreateQuestion">
        <div class="home-invite-btn__text">
          <div class="home-invite-btn__title">发起坦白局</div>
          <div class="home-invite-btn__desc">
            将问题抛到群里，和群友们交换答案吧～
          </div>
        </div>
        <img
          class="home-invite-btn__icon"
          :src="InvitePlay"
          alt="invite your friend"
        />
      </div>
      <div class="home-my-related mb-6">
        <div class="home-title mb-3">我参与的坦白局</div>
        <ParticipateCard
          title="晒出一张你觉得自己最帅的大鸡鸡照片吧！"
          :total="23"
          :users="[
            {
              avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
              nickname: '小明',
            },
            {
              avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
              nickname: '小明',
            },
            {
              avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
              nickname: '小明',
            },
            {
              avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
              nickname: '小明',
            },
            {
              avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
              nickname: '小明',
            },
          ]"
        />
      </div>
      <div class="home-info">
        <h3 class="home-title">公共频道</h3>
        <div class="home-info__shot" @click="showShot">
          Shot: {{ shotCount }}杯
          <img :src="AddShot" class="home-info__add-shot" alt="add shot" />
        </div>
      </div>
      <nut-grid :gutter="12" class="home-topic" :column-num="2">
        <nut-grid-item
          @click="() => goMatching(topic.activityId)"
          :class="['home-topic__item', `home-topic__item-${topic.color}`]"
          v-for="topic in topics"
          :key="topic.title"
        >
          <!-- <div class="home-topic__item__city">{{ city }}</div> -->
          <div>
            <div>{{ topic.title }}</div>
            <div>{{ topic.desc }}</div>
          </div>
          <div class="flex justify-between items-center w100">
            <img
              :src="topic.icon"
              class="home-topic__item-icon"
              mode="aspectFill"
              :alt="topic.title"
            />
            <img
              :src="ArrowRight"
              class="home-topic__item-arrow"
              mode="aspectFill"
              :alt="topic.title"
            />
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
import Play from '../../assets/images/play.svg';
import Sports from '../../assets/images/sports.svg';
import World from '../../assets/images/world.svg';
import Study from '../../assets/images/study.svg';
import ArrowRight from '../../assets/images/arrow_right.svg';
import InvitePlay from '../../assets/images/invite_play.svg';
import { computed } from 'vue';
import { getMyRelatedQues } from '../../api/matching';
import ParticipateCard from '../../components/participateCard/index.vue';

const global = useGlobalStore();
const isVisible = ref(false);
const userId = Taro.getStorageSync('USER_ID');
const shotCount = computed(() => global.userProfile?.shot || 0);

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
    title: '吃喝玩乐',
    desc: '潮男聚集地',
    color: 'DBF378',
    icon: Play,
  },
  {
    activityId: 2,
    title: '运动户外',
    desc: '黑皮体育生',
    color: 'CF83ED',
    icon: Sports,
  },
  {
    activityId: 3,
    title: '旅游看世界',
    desc: '文艺小青年',
    color: '74D172',
    icon: World,
  },
  {
    activityId: 4,
    title: '一起上岸',
    desc: '共勉好兄弟',
    color: '65BAE8',
    icon: Study,
  },
];
const goMatching = (activityId: number) => {
  Taro.navigateTo({
    url: `/pages/matching/index?activityId=${activityId}`,
  });
};

const goToCreateQuestion = () => {
  Taro.navigateTo({
    url: '/pages/create-question/index',
  });
};

const onTest = () => {
  Taro.navigateTo({
    url: '/pages/share-ques-detail/index?shareId=d6eda969cf1dfb3ab9e8cc472c38a92f8719930b38b7831222c352fddc612852',
  });
};
getMyRelatedQues({
  user_id: userId,
});
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
  .home-my-related {
  }
  .home-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    .home-info__shot {
      display: flex;
      align-items: center;
      font-size: 12px;
    }
    .home-info__add-shot {
      margin-left: 4px;
      width: 14px;
      height: 14px;
    }
  }
  .home-title {
    font-size: 16px;
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
      height: 120px;

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
        font-size: 18px;
        font-weight: 700;
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
      .nut-grid-item__text {
        display: none;
      }
      .home-topic__item-icon {
        width: 36px;
        height: 36px;
      }
      .home-topic__item-arrow {
        width: 12px;
        height: 12px;
      }
    }

    // .home-topic__first-item {
    //   flex-basis: 66.66% !important;
    //   .nut-grid-item__content {
    //     background-image: url(../../assets/images/pair_btn_bg.webp);
    //     color: #fff;
    //   }
    // }
    .home-topic__item {
      .nut-grid-item__content {
        padding: 12px 16px 12px 10px;
        align-items: flex-start;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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
  .home-invite-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-radius: 10px;
    height: 90px;
    padding: 10px 13px 10px 20px;
    margin-bottom: 24px;
    background-image: url(../../assets/images/pair_btn_bg.webp);
    background-size: cover;
    .home-invite-btn__text {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .home-invite-btn__title {
      font-size: 18px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 8px;
    }
    .home-invite-btn__desc {
      font-size: 12px;
      color: #fff;
      opacity: 0.6;
    }
    .home-invite-btn__icon {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
