<template>
  <div class="matched-user">
    <nut-config-provider
      theme="dark"
      style="height: 100%"
      :themeVars="{
        darkBackground: '#000000',
        darkBackground2: '#000000',
        darkBackground3: '#000',
      }"
    >
      <nut-tabs v-model="activeTab" style="height: 100%">
        <nut-tab-pane title="个人信息" :pane-key="1">
          <scroll-view :scroll-y="true" class="matched-user__scrollview">
            <div class="matched-user__profile">
              <div class="matched-user__profile-photos">
                <div class="matched-user__profile__photos-mask top"></div>
                <div class="matched-user__profile__photos-name absolute">
                  {{ profile.nickname }}
                </div>
                <div class="matched-user__profile__photos-info">
                  <div class="flex">
                    <div class="matched-user__profile__photos-info-item">
                      {{ basicInfo }}
                    </div>
                  </div>
                  <div class="matched-user__profile__photos-info-ip">
                    IP 归属地: 暂未上线
                  </div>
                </div>
                <nut-swiper
                  :pagination-visible="true"
                  :auto-play="0"
                  height="510"
                  class="matched-user__profile__swiper"
                >
                  <nut-swiper-item
                    v-for="url in profile.avatar_ids"
                    :key="url"
                    class="matched-user__profile__photos-item"
                  >
                    <img
                      class="matched-user__profile__img"
                      :src="url"
                      alt="profile"
                      mode="aspectFill"
                    />
                  </nut-swiper-item>
                </nut-swiper>
                <div class="matched-user__profile__photos-mask bottom"></div>
              </div>
              <div class="matched-user__profile-intro">
                {{ profile.signature }}
              </div>
              <div class="matched-user__profile-info">
                <div
                  class="matched-user__profile-info-row"
                  v-if="profile.career"
                >
                  <img
                    class="matched-user__profile-info-icon"
                    :src="IconJob"
                    alt="job"
                  />
                  行业：{{ Career[profile.career] }}
                </div>
                <div
                  class="matched-user__profile-info-row"
                  v-if="profile.hobby"
                >
                  <img
                    class="matched-user__profile-info-icon"
                    :src="IconHobby"
                    alt="hobby"
                  />
                  爱好：{{
                    profile.hobby
                      .split(',')
                      .map((h) => Hobbies[h])
                      .join(', ')
                  }}
                </div>
                <div
                  class="matched-user__profile-info-row"
                  v-if="profile.favorite"
                >
                  <img
                    class="matched-user__profile-info-icon"
                    :src="IconFavorite"
                    alt="喜好"
                  />
                  喜好：{{
                    profile.favorite
                      .split(',')
                      .map((p) => Favorite[p])
                      .join(', ')
                  }}
                </div>
              </div>
            </div>
          </scroll-view>
          <div class="matched-user__footer">
            <nut-button
              :disabled="!profile.avatar_ids.length"
              v-if="!isMyself"
              type="primary"
              class="matched-user__footer__btn"
              @click="goChat"
            >
              打个招呼
            </nut-button>
          </div>
        </nut-tab-pane>
        <nut-tab-pane title="答案卡" :pane-key="2">
          <ActivityCardList
            class="matched-user__ans-list"
            :get-activity-list="getUserAnswerCardListData"
          />
        </nut-tab-pane>
      </nut-tabs>
      <SwitchWechatPopup
        :targetUserId="userId"
        v-model:visible="switchWechatVisible"
        @onOpenSharePopup="onOpenSharePopup"
      />

      <SharePopup v-model:visible="sharePopupVisible" />
    </nut-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SwitchWechatPopup from '../../biz-components/switchWechatPopup/index.vue';
import SharePopup from '../../biz-components/sharePopup/index.vue';
import ActivityCardList from '../../biz-components/activityCardList/index.vue';
import { getUserAnswerCardList } from '../../api/matching';
import IconJob from '../../assets/images/job.svg';
import IconHobby from '../../assets/images/hobby.svg';
import IconFavorite from '../../assets/images/favorite.svg';
import { getCurrentPageParam } from '../../utils/route';
import { type ProfileData, getUserProfile } from '../../api/user';
import { computed } from 'vue';
import {
  Attribute,
  Shape,
  Career,
  Hobbies,
  Favorite,
} from '../../utils/profileEnum';
import Taro from '@tarojs/taro';

const userId = Number(getCurrentPageParam().userId);
const instance = Taro.getCurrentInstance();
const profile = ref<ProfileData>({
  avatar_ids: [],
  shape: 0,
  height: 0,
  hobby: '',
  signature: '',
  career: 0,
  favorite: '',
  nickname: '',
  attribute: 0,
  weight: 0,
  shot: 0,
});
const activeTab = ref(parseInt(instance?.router?.params.tab || '') || 1);
const switchWechatVisible = ref(false);
const sharePopupVisible = ref(false);
const basicInfo = computed(() => {
  if (!profile.value) return '';
  const { attribute, height, weight, shape } = profile.value;
  // @ts-ignore
  const attrText = Attribute[attribute];
  // @ts-ignore
  const shapeText = Shape[shape];
  const descArr = [
    attrText,
    height ? height + 'cm' : undefined,
    weight ? weight + 'kg' : undefined,
    shapeText,
  ];
  return descArr.filter((item) => item).join(' / ');
});
const isMyself = computed(() => {
  return userId === Number(Taro.getStorageSync('USER_ID'));
});
const getData = async () => {
  try {
    if (!userId) throw new Error('userId is required');
    const res = await getUserProfile(userId);
    if (res) {
      profile.value = res.data;
    }
  } catch (error) {
    console.log(error);
  }
};
getData();

const getUserAnswerCardListData = async (data: {
  a_id: number;
  user_id: number;
  groups: string;
}) => {
  try {
    const res = await getUserAnswerCardList({
      user_id: userId,
      page_length: 10,
      page: data.groups ? data.groups.split(',').length : 0,
    });
    if (res) {
      const { data } = res;
      return {
        ...res,
        data: {
          ...res,
          question: null,
          ad: null,
          answer: data,
          group: 1,
        },
      };
    }
  } catch (error) {
    console.log(error);
  }
};

const onOpenSharePopup = () => {
  sharePopupVisible.value = true;
};

const goChat = () => {
  switchWechatVisible.value = true;
};
</script>

<style lang="scss">
$footer-height: calc(92px + constant(safe-area-inset-bottom));
$footer-height-lagecy: calc(92px + constant(safe-area-inset-bottom));

.matched-user {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  .nut-tabs__content {
    max-height: calc(100% - 46px);
  }
  .nut-tab-pane {
    padding: 0;
  }
  .matched-user__scrollview {
    flex: 1;
    overflow: scroll;
    // height: calc(100% - 46px);
    .matched-user__profile {
      padding: 14px 14px 130px;
      overflow-x: hidden;
      .matched-user__profile-photos {
        position: relative;
      }
      .matched-user__profile__swiper {
        overflow-x: hidden;
        border-radius: 10px;
      }
      .matched-user__profile__img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
      .matched-user__profile__photos-item {
        width: 100%;
      }
      .matched-user__profile__photos-mask {
        width: 100%;
        height: 108px;
        position: absolute;
        left: 0;
        z-index: 11;
        opacity: 0.7;
        &.top {
          top: 0;
          background: linear-gradient(
            180deg,
            #000000 0%,
            rgba(0, 0, 0, 0) 100%
          );
        }
        &.bottom {
          bottom: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 0%,
            #000000 100%
          );
        }
      }
      .matched-user__profile__photos-name {
        position: absolute;
        top: 14px;
        left: 14px;
        font-size: 24px;
        z-index: 20;
        color: #fff;
        font-weight: bold;
      }
      .matched-user__profile__photos-info {
        position: absolute;
        bottom: 30px;
        left: 14px;
        z-index: 20;
        color: #fff;
        .matched-user__profile__photos-info-item {
          font-size: 18px;
        }
        .matched-user__profile__photos-info-ip {
          font-size: 14px;
          color: rgb(128, 128, 128);
        }
      }
    }
    .matched-user__profile-intro {
      font-size: 14px;
      color: #fff;
      margin: 12px 0 12px;
    }
    .matched-user__profile-info-icon {
      width: 14px;
      height: 14px;
    }
    .matched-user__profile-info-row {
      font-size: 14px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      .matched-user__profile-info-icon {
        margin-right: 6px;
      }
    }
  }
  .matched-user__footer {
    position: absolute;
    bottom: 0px;
    display: flex;
    flex-shrink: 0;
    width: 100%;
    padding: 24px 14px 0;
    height: $footer-height; ///*兼容 IOS<11.2*/
    height: $footer-height-lagecy; ///*兼容 IOS>11.2*/
    display: flex;
    padding-bottom: constant(safe-area-inset-bottom); ///*兼容 IOS<11.2*/
    padding-bottom: env(safe-area-inset-bottom); ///*兼容 IOS>11.2*/
  }
  .matched-user__footer__btn {
    flex: 1;
    border-radius: 10px;
    font-weight: bold;
    height: 62px;
    font-size: 20px;
    border-width: 0px;
    .matched-user__footer__btn__love-icon {
      width: 16px;
      height: 14px;
      color: #000;
      margin-right: 6px;
    }
  }
  .matched-user__footer__btn {
    color: #000;
  }
  .matched-user__ans-list {
    padding: 0 12px;
  }
}
</style>
