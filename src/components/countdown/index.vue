<template>
  <nut-countdown v-model="resetTime" :endTime="Date.now() + 600 * 1000">
    <div class="countdown">
      <div class="countdown-item h">
        {{ resetTime.h < 10 ? `0${resetTime.h}` : resetTime.h }}
      </div>
      <span class="countdown-symbol">:</span>
      <div class="countdown-item m">
        {{ resetTime.m < 10 ? `0${resetTime.m}` : resetTime.m }}
      </div>
      <span class="countdown-symbol">:</span>
      <div class="countdown-item s">
        {{ resetTime.s < 10 ? `0${resetTime.s}` : resetTime.s }}
      </div>
    </div>
  </nut-countdown>
</template>
<script lang="ts">
import { reactive } from 'vue';
export default {
  name: 'FCountdown',
  props: {
    end: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const resetTime = reactive({
      d: 1,
      h: 0,
      m: 0,
      s: 0,
    });
    return {
      resetTime,
    };
  },
};
</script>
<style lang="scss">
.countdown {
  display: flex;
  align-items: center;
  .countdown-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background: #dbf378;
    color: #000;
    font-size: 10px;
    font-weight: bold;
    border-radius: 2.5px;
  }

  .countdown-symbol {
    margin: 0 4px;
    font-size: 12px;
    font-weight: bold;
    color: #dbf378;
  }
}
</style>
