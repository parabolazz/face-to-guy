<template>
  <div class="share">
    <div class="share-title">
      <div class="share-title-text">彩虹小酒馆 Party 每晚8点开始</div>
      <Countdown :end="end" />
    </div>
    <div class="share-card">
      <div class="share-card__title">
        <img src="../../assets/images/circle2.svg" />
        <p>仅差1人，小队满员即可获得额外匹配机会！</p>
      </div>

      <div class="share-people-list">
        <img
          v-for="(p, index) in peopleList"
          :key="index"
          :src="p.avatar || defaultAvatar"
        />
      </div>
    </div>
    <div class="share-btn">上车，冲！</div>
    <div class="share-introduction">
      <div class="share-introduction__title">玩法说明：</div>
      <nut-steps direction="vertical">
        <nut-step>
          <template #title>
            <div class="share-introduction__step-title">
              在线云party，全员在线，告别留言板！
            </div>
          </template>
          <template #content>
            <div class="share-introduction__step-content">
              国語、数学、英語、歴史...何でもSimeji
              AI先生に聞いてみてください！一緒に楽しく勉強しましょう！国語、数学、英語、歴史...何でもSimeji
              AI先生に聞いてみてください！一緒に楽しく勉強しましょう！
            </div>
          </template>
        </nut-step>
        <nut-step icon="">
          <template #title>
            <div class="share-introduction__step-title">
              在线云party，全员在线，告别留言板！
            </div>
          </template>
          <template #content>
            <div class="share-introduction__step-content">
              国語、数学、英語、歴史...何でもSimeji
              AI先生に聞いてみてください！一緒に楽しく勉強しましょう！国語、数学、英語、歴史...何でもSimeji
              AI先生に聞いてみてください！一緒に楽しく勉強しましょう！
            </div>
          </template>
        </nut-step>
        <nut-step>
          <template #title>
            <div class="share-introduction__step-title">
              在线云party，全员在线，告别留言板！
            </div>
          </template>
          <template #content>
            <div class="share-introduction__step-content">
              国語、数学、英語、歴史...何でもSimeji
              AI先生に聞いてみてください！一緒に楽しく勉強しましょう！国語、数学、英語、歴史...何でもSimeji
              AI先生に聞いてみてください！一緒に楽しく勉強しましょう！
            </div>
          </template>
        </nut-step>
      </nut-steps>
    </div>
    <nut-popup
      round
      :style="{ width: '310px' }"
      v-model:visible="showPopup"
      class="share-popup"
    >
      <template v-if="hasFinished"> </template>
      <div v-else class="py-4 px-5">
        <h2 class="share-popup__title text-center font-medium mb-3.5">
          {{ isInviter ? '派对邀请' : '已加入结伴' }}
        </h2>
        <div class="share-popup__tip mb-7.5">
          <span class="inline share-popup__tip-text">还差 </span>
          <span
            class="inline share-popup__tip-num text-xl font-medium share-popup__tip-text"
            >{{ data.restNum }}</span
          >
          <span class="inline share-popup__tip-text">
            人，分享派对邀请，三人结伴参加即可每人送3个Shot（Shot可用于干杯等环节），赶快邀请好友来参加吧</span
          >
        </div>
        <img
          src="../../assets/images/weixin.webp"
          width="60px"
          height="60px"
          alt="share_weixin"
        />
      </div>
    </nut-popup>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Countdown from '../../components/countdown/index.vue';

const defaultAvatar =
  'https://cdn.sspai.com/2022/04/01/avatar/45095b5db98c397cc569446d70c0c9a6.png?imageMogr2/auto-orient/quality/95/thumbnail/!200x200r/gravity/Center/crop/200x200/interlace/1';

const end = Date.now() + 20 * 1000;
const showPopup = ref(true);
const isInviter = ref(true);
const hasFinished = ref(false);
const data = ref({
  restNum: 2,
});
const peopleList = [
  {
    avatar:
      'https://cdn.sspai.com/2022/04/01/avatar/45095b5db98c397cc569446d70c0c9a6.png?imageMogr2/auto-orient/quality/95/thumbnail/!200x200r/gravity/Center/crop/200x200/interlace/1',
  },
  {
    avatar: '',
  },
  {
    avatar: '',
  },
];
</script>

<style lang="scss">
.share {
  background-color: #000;
  padding: 0 14px;
  .share-title {
    display: flex;
    padding: 16px 14px;
    color: #fff;
    .share-title-text {
      margin-right: 20px;
    }
  }
  .share-card {
    flex: 1;
    padding: 19px 14px;
    margin-bottom: 28px;
    background-color: #fff;
    border-radius: 10px;
    .share-card__title {
      display: flex;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
      p {
        font-size: 14px;
        color: #000;
      }
    }
    .share-people-list {
      display: flex;
      margin-top: 20px;
      justify-content: space-around;
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
    }
  }
  .share-btn {
    background-color: #dbf378;
    padding: 19px 10px;
    border-radius: 10px;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
  }
  .share-introduction {
    margin-top: 60px;
    .share-introduction__title {
      font-size: 18px;
      color: #dbf378;
      margin-bottom: 18px;
    }
    .share-introduction__step-title {
      padding-bottom: 24px;
      color: #fff;
    }
    .share-introduction__step-content {
      padding-bottom: 34px;
    }
  }
}
.share-popup {
  padding: 16px 20px;
  .share-popup__title {
    font-size: 22px;
  }
  .share-popup__tip-num {
    color: rgb(255, 64, 63);
  }
  .share-popup__tip-text {
    line-height: 22px;
  }
}
</style>
