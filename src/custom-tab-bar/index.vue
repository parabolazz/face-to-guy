<template>
  <div class="tab-bar" v-show="global.showTabbar">
    <div class="tab-bar-border"></div>
    <div
      v-for="(item, index) in list"
      :key="index"
      class="tab-bar-item"
      @tap="switchTab(index, item.pagePath)"
    >
      <nut-badge dot :hidden="!item.needBadge || !global.unreadCount">
        <img
          class="tab-bar-icon"
          :src="
            global.activeTabIndex === index
              ? item.selectedIconPath
              : item.iconPath
          "
        />
      </nut-badge>
      <div
        class="tab-bar-text"
        :style="{
          color: global.activeTabIndex === index ? selectedColor : color,
        }"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import Taro from '@tarojs/taro';
import { getUserProfile } from '../api/user';
import { computed } from 'vue';
import { useGlobalStore } from '../store';
import PartyIcon from './images/party.png';
import PartySelectedIcon from './images/party_selected.png';
import MessageIcon from './images/message.png';
import MessageSelectedIcon from './images/message_selected.png';
import MeIcon from './images/me.png';
import MeSelectedICon from './images/me_selected.png';
import { getUnreadMessageLength } from '../api/message';
import { onMounted } from 'vue';

const color = '#5F5F5F';
const selectedColor = '#DBF378';
const global = useGlobalStore();

const list = [
  {
    /** 页面路径，必须在 pages 中先定义 */
    pagePath: '/pages/home/index',
    /** tab 上按钮文字 */
    text: '圈子',
    /** 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，当 position 为 top 时，此参数无效，不支持网络图片 */
    iconPath: PartyIcon,
    /** 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px ，当 position 为 top 时，此参数无效 */
    selectedIconPath: PartySelectedIcon,
  },
  {
    pagePath: '/pages/chats/index',
    text: '消息',
    iconPath: MessageIcon,
    selectedIconPath: MessageSelectedIcon,
    needBadge: 1,
  },
  {
    pagePath: '/pages/me/index',
    text: '我的',
    iconPath: MeIcon,
    selectedIconPath: MeSelectedICon,
  },
];
function switchTab(index, url) {
  setSelected(index);
  Taro.switchTab({ url });
}
function setSelected(index) {
  global.setActiveTabIndex(index);
}
async function initUserInfo() {
  if (Taro.getStorageSync('TOKEN') && !global.userProfile) {
    global.getUserProfile();
  }
}
initUserInfo();
onMounted(() => {
  if (Taro.getStorageSync('TOKEN') && !global.unreadMsgInterval) {
    global.fetchIfMsgRead();
  }
});
</script>

<style lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #2c2c2c;
  display: flex;
  justify-content: space-between;
  padding: 15px 38px calc(env(safe-area-inset-bottom) - 5px);

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
    box-sizing: border-box;
    width: 28px;
    height: 28px;
    margin-bottom: 8px;
  }
  .tab-bar-text {
    font-size: 12px;
  }
}
</style>
