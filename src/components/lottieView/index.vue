<template>
  <canvas class="canvas" id="lottie" type="2d" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import Taro from '@tarojs/taro';
import Lottie from 'lottie-miniprogram';

const props = defineProps({
  id: {
    type: String,

    default: '',
  },

  // jsonData: {
  // type: Object,

  // default: lottieJson,
  // },

  autoplay: {
    type: Boolean,

    default: false,
  },

  loop: {
    type: Boolean,

    defalut: false,
  },

  assetsPath: {
    type: String,

    defalut: '',
  },
});

// const emits = defineEmits(['onComplete']);

const sysinfo = Taro.getSystemInfoSync(); //获取设备系统的数据

const pixelRatio = ref(sysinfo.pixelRatio);

let lottieObj: any = undefined;

Taro.useDidShow(() => {
  console.log('lottie---useReady');

  setTimeout(() => {
    init(1);
  }, 0);
});

// onMounted(()=>{

// console.log('lottie---onMounted');

// setTimeout(()=>{

// init(3)

// }, 10)

// })

const inited = ref(false);

// 初始化加载动画

const init = (type) => {
  console.log('type', type);

  if (inited.value) {
    return;
  }

  Taro.createSelectorQuery()
    .select(`#lottie`)
    .node((res) => {
      console.log('res', res);

      const canvas = res.node;

      if (canvas) {
        const context = canvas.getContext('2d');

        if (pixelRatio.value) {
          context.scale(pixelRatio.value, pixelRatio.value);

          canvas.width = 300 * pixelRatio.value;

          canvas.height = 300 * pixelRatio.value;
        }

        Lottie.setup(canvas);

        lottieObj = Lottie.loadAnimation({
          loop: true,
          autoplay: true,
          animationData: require('../../assets/lottie/sample1.json'),
          rendererSettings: {
            context,
          },
        });

        inited.value = true;

        // emits('onComplete')
      }
    })
    .exec();
};

const play = () => {
  lottieObj && lottieObj.play();
};

const stop = () => {
  lottieObj && lottieObj.stop();
};

const pause = () => {
  lottieObj && lottieObj.pause();
};

defineExpose({
  play,

  stop,

  pause,
});
</script>

<style lang="less"></style>
