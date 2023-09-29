<template>
  <div class="activity-list-item">
    <img
      class="activity-list-item__img"
      mode="aspectFill"
      :src="data.activityImg"
      alt="activity img"
    />
    <div class="activity-list-item__info">
      <nut-ellipsis
        class="activity-list-item__info-title"
        :content="`${data.title}asdsadsa sdasdsadsa sadasd`"
        direction="end"
      ></nut-ellipsis>
      <div>
        <div class="activity-list-item__info-item">
          <img
            class="activity-list-item__info-item-img"
            :src="TimeSvg"
            alt="time"
          />
          {{ data.time }}
        </div>
        <div class="activity-list-item__info-item">
          <img
            class="activity-list-item__info-item-img"
            :src="LocationSvg"
            alt="ocation"
          />
          {{ data.location }}
        </div>
      </div>
      <div class="activity-list-item__footer">
        <div class="activity-list-item__footer-left">
          <img
            class="activity-list-item__footer-user-avatar"
            :style="{
              zIndex: data.userAvatars.length - index,
              left: index * 12 + 'px',
            }"
            mode="aspectFill"
            v-for="(avatar, index) in data.userAvatars"
            :key="avatar"
            :src="avatar"
            alt="user avatar"
          />
          <div
            :style="{
              position: 'absolute',
              top: '55%',
              transform: 'translateY(-50%)',
              fontSize: '12px',
              lineHeight: '12px',
              left: (data.userAvatars.length + 1) * 14 + 'px',
            }"
          >
            {{ data.current + '/' + data.limit || '不限' }}
          </div>
        </div>
        <slot>
          <nut-button
            class="activity-list-item__btn"
            type="primary"
            size="small"
            >摇个人一起</nut-button
          >
        </slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import TimeSvg from '../../assets/images/time.svg';
import LocationSvg from '../../assets/images/location.svg';

export interface ActivityListItemProps {
  activityId: number;
  title: string;
  activityImg: string;
  location: string;
  time: string;
  limit: number;
  current: number;
  userAvatars: string[];
}

interface Props {
  data: ActivityListItemProps;
}

defineProps<Props>();
</script>
<style lang="scss">
.activity-list-item {
  display: flex;
  width: 100%;
  background: #232323;
  border-radius: 10px;
  overflow: hidden;
  .activity-list-item__img {
    width: 126px;
    height: 126px;
    border-radius: 10px;
  }
  .activity-list-item__info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    padding: 12px;
  }
  .activity-list-item__info-title {
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
    margin-bottom: 6px;
    color: #fff;
  }
  .activity-list-item__info-item {
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 16px;
    color: #acabab;
  }
  .activity-list-item__info-item-img {
    width: 12px;
    height: 12px;
    margin-right: 4px;
    color: #acabab;
  }
  .activity-list-item__footer-user-avatar {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    border: 2px solid #ffffff;
  }
  .activity-list-item__footer {
    display: flex;
    justify-content: space-between;
    // margin-top: 16px;
  }
  .activity-list-item__footer-left {
    position: relative;
    display: flex;
    align-items: center;
  }
  .activity-list-item__btn {
    color: #000;
    font-size: 12px;
    font-weight: 500;
  }
}
</style>
