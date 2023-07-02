<template>
  <nut-config-provider theme="dark">
    <div class="chat">
      <div class="chat__main">hello world</div>
      <div class="chat__footer" :style="inputStyle">
        <nut-input
          class="chat__footer-input"
          :border="false"
          placeholder="请输入内容"
          v-model="inputContent"
          @onEnter="handleSend"
          @focus="inputBindFocus"
          @blur="inputBindBlur"
          :adjust-position="false"
        ></nut-input>
        <img
          src="../../assets/images/add_circle.svg"
          class="chat_footer-input-more"
          alt="more"
        />
      </div>
    </div>
  </nut-config-provider>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const inputStyle = ref({});
const inputContent = ref('');
const handleSend = () => {
  console.log(inputContent.value);
};
const inputBindFocus = (e: any) => {
  inputStyle.value = {
    bottom: e.detail.height + 'px',
    paddingBottom: 9 + 'px',
  };
};
const inputBindBlur = () => {
  inputStyle.value = {
    bottom: 0 + 'px',
  };
};
</script>
<style lang="scss">
.nut-theme-dark {
  height: 100%;
}
.chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: constant(safe-area-inset-bottom); // 适配全面屏
  padding-bottom: env(safe-area-inset-bottom);

  .chat__footer {
    position: absolute; // input 所在盒子设置绝对定位
    flex-shrink: 0;
    width: 100%;
    left: 0;
    bottom: 0; // 默认 0
    z-index: 199;
    padding-left: 12px;
    padding-right: 12px;
    padding-top: 9px;
    padding-bottom: constant(safe-area-inset-bottom); // 适配全面屏
    padding-bottom: env(safe-area-inset-bottom);
    background: #ffffff;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background-color: #2c2c2c;
    .chat__footer-input {
      overflow: hidden;
      background: #474747;
      padding: 9px 12px;
      border-radius: 9px;
    }
    .chat_footer-input-more {
      width: 38px;
      height: 38px;
      margin-left: 8px;
    }
  }
}
</style>
