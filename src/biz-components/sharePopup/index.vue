<template>
  <nut-action-sheet
    :visible="visible"
    class="share-popup"
    @update:visible="onToggleVisible"
  >
    <div class="share-popup__content">
      <div class="share-popup-collapse"></div>
      <div class="share-popup__user">
        <img
          class="share-popup__user-avatar"
          :src="global.userProfile?.avatar_ids?.[0]"
          alt="user logo"
        />
        <div class="share-popup__user-shot-info">
          <div class="share-popup__user-shot">
            <span class="share-popup__user-shot-count">{{ userShot }}</span>
            Shot
          </div>
          <p>每干杯一次消耗一杯Shot</p>
        </div>
      </div>
      <nut-divider :style="{ color: '#353535', margin: 0 }" />
      <div class="share-popup__action">
        <h4 class="share-popup__action-title">做任务得Shot</h4>
        <div
          v-for="action in shareActions"
          :key="action.title"
          class="share-popup__action-item"
        >
          <div class="share-popup__action-icon-wrap">
            <img :src="action.icon" alt="action icon" />
          </div>
          <div class="share-popup__action-item-text">
            <div class="share-popup__action-item-title">
              {{ action.title }}
              <span class="share-popup__action-item-tip">{{ action.tip }}</span>
            </div>
            <div class="share-popup__action-item-desc">
              {{ action.desc }}
            </div>
          </div>
          <nut-button
            type="primary"
            class="share-popup__action-item-btn"
            :disabled="action.disabled"
            :openType="action.openType"
            @click="action?.onClick"
            >{{ action.buttonText }}</nut-button
          >
        </div>
      </div>
    </div>
  </nut-action-sheet>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro';
import CalendarIcon from '../../assets/images/calendar.svg';
import ShareIcon from '../../assets/images/share.svg';
import VideoIcon from '../../assets/images/video.svg';
import { ref } from 'vue';
import { computed } from 'vue';
import { Action, updateShot } from '../../api/user';
import { useGlobalStore } from '../../store';
import { watch } from 'vue';

defineProps({
  visible: Boolean,
});

const global = useGlobalStore();
const lastCheckInDay = Taro.getStorageSync('LAST_CHECK_IN_DAY');
const userShot = computed(() => global.userProfile?.shot || 0);

const emit = defineEmits(['update:visible']);
const hasCheckInToday = ref(
  lastCheckInDay ? dayjs().format('YYYY-MM-DD') === lastCheckInDay : false,
);
const lastShareTime = ref(Taro.getStorageSync('LAST_SHARE_TIME'));
const canNotShare = computed(() => {
  return (
    lastShareTime.value && dayjs().diff(dayjs(lastShareTime.value), 'hour') < 1
  );
});
const onToggleVisible = (visible: boolean) => {
  emit('update:visible', visible);
};
useShareTimeline(() => {
  return {
    title: '年轻人超爱的小程序，快来找你的神仙搭子吧',
    query: 'share=1',
    imageUrl: 'http://tmp/Wp6HBLmMTlQB93b219ce2731cae16082af5b0fe33c0a.jpg',
  };
});
useShareAppMessage(() => {
  return {
    title: '年轻人超爱的小程序，快来找你的神仙搭子吧',
    path: '/pages/home/index',
    imageUrl: 'http://tmp/Wp6HBLmMTlQB93b219ce2731cae16082af5b0fe33c0a.jpg',
  };
});

const shareActions = computed(() => [
  {
    icon: CalendarIcon,
    title: '每日签到',
    tip: 'Shot +3',
    desc: '每日签到都可以领取一次奖励',
    buttonText: hasCheckInToday.value ? '已签到' : '去签到',
    disabled: hasCheckInToday.value,
    onClick: async () => {
      try {
        await updateShot(userShot.value + 3, Action.CheckIn);
        hasCheckInToday.value = true;
        Taro.setStorageSync('LAST_CHECK_IN_DAY', dayjs().format('YYYY-MM-DD'));
      } catch (error) {
        console.log('error', error);
      }
    },
  },
  {
    icon: VideoIcon,
    title: '看广告XX秒',
    tip: 'Shot +1',
    desc: '可无限次观看广告获得奖励',
    buttonText: '看广告',
  },
  {
    icon: ShareIcon,
    title: '分享小程序',
    tip: 'Shot +2',
    desc: '对方点击链接登录即可获得奖励',
    buttonText: '去分享',
    openType: canNotShare.value ? undefined : 'share',
    onClick() {
      // 如果距离上一次分享不到一个小时
      if (canNotShare.value) {
        Taro.showToast({
          title: '分享太频繁啦，请先休息一下吧',
          icon: 'none',
          duration: 2000,
        });
        return;
      } else {
        setTimeout(async () => {
          try {
            await updateShot(userShot.value + 2, Action.Share);
            lastShareTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
            Taro.showToast({
              title: '分享成功',
              icon: 'success',
              duration: 2000,
            });
          } catch (error) {
            console.log('error', error);
          }
        }, 2000);
      }
    },
  },
]);

watch(
  () => lastShareTime.value,
  (newVal) => {
    if (newVal) {
      Taro.setStorageSync('LAST_SHARE_TIME', newVal);
    }
  },
);
</script>
<style lang="scss">
.share-popup {
  .nut-popup {
    height: calc(390px + env(safe-area-inset-bottom));
  }
  .nut-action-sheet {
    height: 100%;
  }
  .share-popup__content {
    height: 100%;
    padding: 13px 12px 0;
    overflow: hidden;
  }

  .share-popup-collapse {
    width: 40px;
    height: 4px;
    border-radius: 27px;
    margin: 0 auto;
    background-color: #565656;
    margin-bottom: 21px;
  }
  .share-popup__user {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
  }
  .share-popup__user-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    margin-right: 12px;
  }
  .share-popup__user-shot {
    display: flex;
    align-items: flex-end;
    color: #fff;
    margin-bottom: 6px;
  }
  .share-popup__user-shot-info {
    display: flex;
    flex-direction: column;
    font-size: 12px;
  }
  .share-popup__user-shot-count {
    font-size: 27px;
    color: #dbf378;
    font-weight: bold;
    line-height: 1;
    margin-right: 7px;
  }
  .share-popup__action {
    padding: 21px 0;
    .share-popup__action-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .share-popup__action-item {
      display: flex;
      align-items: center;
      &:not(:last-child) {
        margin-bottom: 22px;
      }
    }
    .share-popup__action-icon-wrap {
      width: 42px;
      height: 42px;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: #424242;
      img {
        width: 21px;
      }
    }
    .share-popup__action-item-title {
      display: flex;
      align-items: flex-start;
      font-size: 14px;
      color: #fff;
    }
    .share-popup__action-item-tip {
      margin-left: 7px;
      font-size: 12px;
      color: #dbf378;
      font-weight: 800;
    }
    .share-popup__action-item-text {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .share-popup__action-item-desc {
      margin-top: 2px;
      font-size: 12px;
    }
    .share-popup__action-item-btn {
      height: auto;
      padding: 7px 16px;
      color: #000;
      font-weight: bold;
      font-size: 12px;
      line-height: 14px;
    }
  }
}
</style>
