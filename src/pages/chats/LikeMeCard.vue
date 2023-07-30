<template>
  <div class="my-like-card">
    <div class="my-like-card__info">
      <div class="flex">
        <img :src="info.avatar_id" alt="avatar" class="my-like-card__avatar" />
        <div class="my-like-card__ids">
          <div class="nick-name">{{ info.nick_name }}</div>
          <div class="wechat-id">微信号：{{ info.wechatId }}</div>
        </div>
      </div>
      <nut-button type="primary" plain class="my-like-card__btn"
        >复制微信</nut-button
      >
    </div>
    <div class="my-like-card__message">{{ info.messgae }}</div>
  </div>
</template>
<script lang="ts" setup>
const info = {
  avatar_id: 'https://avatars.githubusercontent.com/u/499550?v=4',
  nick_name: 'hello mark',
  wechatId: 'asdssss11',
  messgae:
    'Hi～靓仔，在观看了你的答案卡之后，我对你非常感兴趣，以下是我的微信号：XXXXXX。如果你也对我感兴趣，可以加我微信',
};
</script>
<style lang="scss">
.my-like-card {
  display: flex;
  flex-direction: column;
  padding: 12px 12px 16px;
  background-color: #232323;
  border-radius: 9px;
  overflow: hidden;
  .my-like-card__info {
    display: flex;
    justify-content: space-between;
  }
  .my-like-card__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
  .my-like-card__ids {
    margin-left: 10px;
    .nick-name {
      font-size: 16px;
      color: #fff;
      font-weight: bold;
    }
    .wechat-id {
      font-size: 14px;
    }
  }
  .my-like-card__btn {
    background-color: transparent !important;
    font-weight: bold;
    border-radius: 10px;
  }
  .my-like-card__message {
    border-radius: 10px;
    opacity: 1;
    background: #404040;
    color: #fff;
    font-size: 14px;
    padding: 12px;
    margin-top: 20px;
  }
}
</style>
