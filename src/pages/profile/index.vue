<template>
  <nut-config-provider theme="dark">
    <view class="profile">
      <nut-form :model-value="state" ref="formRef">
        <nut-form-item required prop="nickname" label="姓名">
          <input
            v-model="state.nickname"
            class="nut-input-text"
            placeholder="请输入姓名"
            type="text"
          />
        </nut-form-item>
        <nut-form-item prop="introduction" label="个性签名">
          <nut-textarea
            style="padding: '10px'"
            v-model="state.introduction"
            placeholder="人生即一场相遇,即使错过也不深究"
            :autosize="{ minHeight: 50, maxHeight: 200 }"
          />
        </nut-form-item>
        <nut-form-item label="属性" prop="type">
          <input
            class="nut-input-text"
            @click="() => (drawerController.typeVisible = true)"
            readonly
            placeholder="请选择属性"
            type="text"
          />
        </nut-form-item>

        <!-- <nut-form-item label="身高" prop="height">
          <input
            v-model="state.height"
            class="nut-input-text"
            @click="drawerController.heightVisible = true"
            readonly
            placeholder="请输入身高"
            type="text"
          />
          <nut-picker
            v-model="state.height"
            v-model:visible="drawerController.heightVisible"
            :columns="optionsController.type"
            @confirm="(type) => (state.type = type)"
          >
          </nut-picker>
        </nut-form-item> -->
      </nut-form>
      <view> hello world </view>

      <nut-cascader
        title="aha"
        v-model:visible="drawerController.typeVisible"
        :threeDimensional="false"
        :options="optionsController.type"
      >
      </nut-cascader>
    </view>
  </nut-config-provider>
</template>

<script>
import { reactive, toRefs } from 'vue';
export default {
  name: 'ProfilePage',
  setup() {
    const state = reactive({
      nickname: '',
      introduction: '',
      type: '',
      height: '',
    });
    const drawerController = reactive({
      typeVisible: false,
      heightVisible: false,
    });
    const optionsController = reactive({
      type: [
        { value: 'tp', text: 'Tp' },
        { value: 'btm', text: 'Bottom' },
        { value: 'vers', text: 'Vers' },
        { value: 'others', text: 'Others' },
      ],
    });
    const valueForPicker = reactive({
      type: [state.type],
      height: [state.height],
    });

    const handleClick = (type, msg, cover = false) => {
      state.show = true;
      state.msg2 = msg;
      state.type = type;
      state.cover = cover;
    };

    return {
      state,
      handleClick,
      drawerController,
      optionsController,
      valueForPicker,
    };
  },
};
</script>

<style lang="scss">
.profile {
  ::v-deep .nut-textarea__textarea {
    padding: 10px;
  }
}
</style>
