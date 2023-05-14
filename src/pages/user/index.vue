<template>
  <div class="matched-user">
    <scroll-view :scroll-y="true" class="matched-user__scrollview">
      <div class="matched-user__profile">
        <div class="matched-user__profile-photos">
          <div class="matched-user__profile__photos-mask top"></div>
          <div class="matched-user__profile__photos-name absolute">
            {{ profile.name }}
          </div>
          <div class="matched-user__profile__photos-info">
            <div class="flex">
              <div class="matched-user__profile__photos-info-item">
                {{ profile.type }} /
              </div>
              <div class="matched-user__profile__photos-info-item">
                {{ profile.height }}cm /
              </div>
              <div class="matched-user__profile__photos-info-item">
                {{ profile.weight }}kg /
              </div>
              <div class="matched-user__profile__photos-info-item">
                {{ profile.bodyType }}
              </div>
            </div>
            <div class="matched-user__profile__photos-info-ip">
              IP 归属地: {{ profile.ipSite }}
            </div>
          </div>
          <nut-swiper
            :pagination-visible="true"
            :auto-play="0"
            height="510"
            class="matched-user__profile__swiper"
          >
            <nut-swiper-item
              v-for="url in profile.urls"
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
          {{ profile.intro }}
        </div>
        <div class="matched-user__profile-info">
          <div class="matched-user__profile-info-row" v-if="profile.job">
            <img
              class="matched-user__profile-info-icon"
              :src="IconJob"
              alt="job"
            />
            行业：{{ profile.job }}
          </div>
          <div class="matched-user__profile-info-row" v-if="profile.hobbies">
            <img
              class="matched-user__profile-info-icon"
              :src="IconHobby"
              alt="hobby"
            />
            爱好：{{ profile.hobbies.join(', ') }}
          </div>
          <div class="matched-user__profile-info-row" v-if="profile.likeType">
            <img
              class="matched-user__profile-info-icon"
              :src="IconFavorite"
              alt="喜好"
            />
            喜好：{{ profile.likeType.join(', ') }}
          </div>
        </div>
      </div>
    </scroll-view>
    <div class="matched-user__footer">
      <div class="matched-user__footer__btn">再看看</div>
      <div class="matched-user__footer__btn">
        <img
          class="matched-user__footer__btn__love-icon"
          :src="IconFavoriteBlack"
          alt="love him"
        />
        我可以
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useGlobalStore } from '../../store';
import IconJob from '../../assets/images/job.svg';
import IconHobby from '../../assets/images/hobby.svg';
import IconFavorite from '../../assets/images/favorite.svg';
import IconFavoriteBlack from '../../assets/images/favorite_black.svg';

const globalStore = useGlobalStore();
globalStore.toggleTabbar(false);

const profile = reactive({
  urls: [
    'https://p9.itc.cn/q_70/images03/20200703/e49a469ebe9c4082a68ea652fb1124d6.jpeg',
    'https://media.vogue.com.tw/photos/5e65e6702b0ea500085cc6b0/2:3/w_2560%2Cc_limit/IMG_9039.JPG',
    'https://pic2.zhimg.com/80/v2-440034de16c1e3fb1527cb33b4b4f049_1440w.webp',
  ],
  name: 'Forever 纯1???',
  type: 'Tp',
  height: 188,
  weight: 88,
  bodyType: '肌肉',
  job: '金融',
  hobbies: ['跑步', '篮球', '滑雪'],
  likeType: ['肌肉', '匀称'],
  ipSite: '深圳',
  intro:
    '国語、数学、英語、歴史...何でもSimejiAI先生に聞いてみてください！一緒に楽しく勉強しましょう！',
});
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
  .matched-user__scrollview {
    flex: 1;
    overflow: scroll;
    height: 1px;

    .matched-user__profile {
      padding: 0 14px 43px;
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
      margin: 14px 0 12px;
    }
    .matched-user__profile-info-icon {
      width: 14px;
      height: 11px;
    }
    .matched-user__profile-info-row {
      font-size: 14px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      .matched-user__profile-info-icon {
        margin-right: 4px;
      }
    }
  }
  .matched-user__footer {
    display: flex;
    flex-shrink: 0;
    width: 100%;
    padding: 24px 14px 0;
    height: $footer-height; ///*兼容 IOS<11.2*/
    height: $footer-height-lagecy; ///*兼容 IOS>11.2*/
    display: flex;
    border-top: 1rpx solid #eaeef1;
    padding-bottom: constant(safe-area-inset-bottom); ///*兼容 IOS<11.2*/
    padding-bottom: env(safe-area-inset-bottom); ///*兼容 IOS>11.2*/
  }
  .matched-user__footer__btn {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    font-weight: 500;
    height: 62px;
    font-size: 20px;
    .matched-user__footer__btn__love-icon {
      width: 16px;
      height: 14px;
      color: #000;
      margin-right: 6px;
    }
  }
  .matched-user__footer__btn:first-child {
    margin-right: 14px;
    border: 2px solid #ffffff;
    color: #fff;
  }
  .matched-user__footer__btn:last-child {
    background-color: #dbf378;
    color: #000;
  }
}
</style>
