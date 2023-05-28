<template>
  <view class="message-item">
    <img :src="data[index].icon" alt="icon" class="message-item__icon" />
    <div class="message-item__text">
      <div class="message-item__text-title">Row {{ data[index].name }}</div>
      <div class="message-item__text-msg">
        Row {{ data[index].lastMessage }}
      </div>
    </div>
    <div class="message-item-time">
      {{ timeDifference(data[index].now, data[index].time) }}
    </div>
  </view>
</template>

<script setup lang="ts">
import { timeDifference } from '../../utils/timeDifference';

interface MessageItem {
  icon: string;
  name: string;
  lastMessage: string;
  time: number;
  now: number;
}
defineProps<{
  id: string;
  index: number;
  data: MessageItem[];
}>();
</script>
<style lang="scss">
.message-item {
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  .message-item__icon {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .message-item__text {
    flex-grow: 1;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 16px;
    .message-item__text-title {
      color: #fff;
    }
  }
  .message-item-time {
    flex-shrink: 0;
    font-size: 14px;
  }
}
</style>
