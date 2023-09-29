<template>
  <nut-config-provider theme="dark">
    <scroll-view class="home" :scroll-y="true">
      <div class="home-nearby">
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
      </div>
      <div class="home-same-city">
        <div class="home-head">
          <h3 class="home-title">同城活动</h3>
        </div>
        <div class="flex-column">
          <ActivityListItem
            v-for="item in sameCityActivities"
            :key="item.activityId"
            class="home-same-city__item"
            :data="item"
            @click="() => goActivityDetail(item.activityId)"
          ></ActivityListItem>
        </div>
      </div>
      <SharePopup v-model:visible="isVisible" />
    </scroll-view>
  </nut-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Taro from '@tarojs/taro';
import { useGlobalStore } from '../../store';
import AddShot from '../../assets/images/shot_add.svg';
import SharePopup from '../../biz-components/sharePopup/index.vue';
import ActivityListItem, {
  type ActivityListItemProps,
} from '../../components/activityListItem/index.vue';
import { computed } from 'vue';

console.log('SharePopup', SharePopup);

const global = useGlobalStore();
const isVisible = ref(false);

const shotCount = computed(() => global.userProfile?.shot || 0);
const city = ref('深圳');
const sameCityActivities = ref<ActivityListItemProps[]>([]);

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
const goActivityDetail = (activityId: number) => {
  Taro.navigateTo({
    url: `/pages/activityDetail/index?activityId=${activityId}`,
  });
};
sameCityActivities.value = [
  {
    activityId: 1,
    title: '吃喝玩乐 摇一摇',
    time: '2021-08-08 12:00',
    location: '深圳市南山区',
    activityImg: 'https://picsum.photos/200/300?random=1',
    limit: 40,
    current: 20,
    userAvatars: [
      // avatar sample
      'https://img2.baidu.com/it/u=2186663613,2577256303&fm=26&fmt=auto&gp=0.jpg',
    ],
  },
  {
    activityId: 2,
    title: '看电影',
    time: '2021-08-15 18:00',
    location: '上海市徐汇区',
    activityImg: 'https://picsum.photos/200/300?random=2',
    limit: 30,
    current: 10,
    userAvatars: [
      'https://picsum.photos/50/50?random=1',
      'https://picsum.photos/50/50?random=2',
      'https://picsum.photos/50/50?random=3',
    ],
  },
];
</script>

<style lang="scss">
.home {
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 120px;
  padding: 14px 14px 120px 14px;
  .home-nearby {
    margin-bottom: 36px;
  }
  .home-same-city__item {
    margin-bottom: 12px;
  }
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
