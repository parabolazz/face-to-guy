<template>
  <cover-view class="tab-bar">
    <cover-view class="tab-bar-border"></cover-view>
    <cover-view
      v-for="(item, index) in list"
      :key="index"
      class="tab-bar-item"
      @tap="switchTab(index, item.pagePath)"
    >
      <image
        class="tab-bar-icon"
        :src="selected === index ? item.selectedIconPath : item.iconPath"
      />
      <view
        class="tab-bar-text"
        :style="{ color: selected === index ? selectedColor : color }"
        >{{ item.text }}</view
      >
    </cover-view>
  </cover-view>
</template>

<script setup>
import Taro from '@tarojs/taro';
import { computed } from 'vue';
// import { useStore } from 'vuex';
// const store = useStore();
// const selected = computed(() => store.getters.getSelected);
const selected = 0;
const color = '#5F5F5F';
const selectedColor = '#DBF378';
const list = [
  {
    /** 页面路径，必须在 pages 中先定义 */
    pagePath: '/pages/home/index',
    /** tab 上按钮文字 */
    text: '派对',
    /** 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，当 position 为 top 时，此参数无效，不支持网络图片 */
    iconPath: '/assets/images/party.png',
    /** 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px ，当 position 为 top 时，此参数无效 */
    selectedIconPath: '/assets/images/party_selected.png',
  },
  {
    pagePath: '/pages/chats/index',
    text: '消息',
    iconPath: '/assets/images/message.png',
    selectedIconPath: '/assets/images/message_selected.png',
  },
  {
    pagePath: '/pages/me/index',
    text: '我的',
    iconPath: '/assets/images/me.png',
    selectedIconPath: '/assets/images/me_selected.png',
  },
];
function switchTab(index, url) {
  setSelected(index);
  Taro.switchTab({ url });
}
function setSelected(index) {
  // store.dispatch('setSelected', index);
}
</script>

<style lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: #2c2c2c;
  display: flex;
  justify-content: space-between;
  padding: 0 38px;
  padding-bottom: env(safe-area-inset-bottom);

  .tab-bar-border {
    background-color: rgba(0, 0, 0, 0.33);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    transform: scaleY(0.5);
  }
  .tab-bar-item {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .tab-bar-icon {
    width: 34px;
    height: 34px;
    margin-bottom: 4px;
  }
  .tab-bar-text {
    font-size: 12px;
  }
}
</style>
