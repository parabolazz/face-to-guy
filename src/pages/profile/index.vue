<template>
  <nut-config-provider theme="dark" :theme-vars="themeVars">
    <view class="profile">
      <nut-form :model-value="state" ref="formRef">
        <view class="profile-imageset">
          <nut-form-item>
            <nut-grid :column-num="3" square :border="false" :center="false">
              <nut-grid-item>
                <Uploader
                  :url="'https://www.baidu.com'"
                  v-model:file-list="state.image[0]"
                  :is-preview="false"
                >
                  <template #tip>
                    <view class="tip">头像</view>
                  </template>
                </Uploader>
              </nut-grid-item>
              <nut-grid-item>
                <Uploader
                  :url="'https://www.baidu.com'"
                  v-model:file-list="state.image[0]"
                  :is-preview="false"
                >
                </Uploader>
              </nut-grid-item>
              <nut-grid-item>
                <Uploader
                  :url="'https://www.baidu.com'"
                  v-model:file-list="state.image[0]"
                  :is-preview="false"
                >
                </Uploader>
              </nut-grid-item>
            </nut-grid>
            <nut-grid :column-num="3" square :border="false" :center="false">
              <nut-grid-item>
                <Uploader
                  :url="'https://www.baidu.com'"
                  v-model:file-list="state.image[0]"
                  :is-preview="false"
                >
                </Uploader>
              </nut-grid-item>
              <nut-grid-item>
                <Uploader
                  :url="'https://www.baidu.com'"
                  v-model:file-list="state.image[0]"
                  :is-preview="false"
                >
                </Uploader>
              </nut-grid-item>
              <nut-grid-item>
                <Uploader
                  :url="'https://www.baidu.com'"
                  v-model:file-list="state.image[0]"
                  :is-preview="false"
                >
                </Uploader>
              </nut-grid-item>
            </nut-grid>
          </nut-form-item>
        </view>
        <view class="profile-block">
          <nut-form-item required prop="nickname" label="姓名">
            <nut-input
              input-align="right"
              :border="false"
              v-model="state.nickname"
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
        </view>
        <view class="profile-block">
          <nut-form-item label="属性" prop="type">
            <nut-input
              input-align="right"
              :border="false"
              v-model="state.type"
              @click="() => (drawerController.typeVisible = true)"
              readonly
              placeholder="请选择属性"
              type="text"
            />
          </nut-form-item>

          <nut-form-item label="身高" prop="height">
            <view class="flex">
              <nut-input
                input-align="right"
                :border="false"
                v-model="state.height"
                format-trigger="onChange"
                placeholder="请输入身高"
                type="digit"
              />
              CM
            </view>
          </nut-form-item>

          <nut-form-item label="体重" prop="weight">
            <view class="flex">
              <nut-input
                input-align="right"
                :border="false"
                v-model="state.weight"
                format-trigger="onChange"
                placeholder="请输入体重"
                type="digit"
              />
              KG
            </view>
          </nut-form-item>

          <nut-form-item label="体型" prop="bodyType">
            <nut-input
              input-align="right"
              :border="false"
              v-model="state.bodyType"
              placeholder="请选择体型"
              readonly
              @click="() => (drawerController.bodyVisible = true)"
            />
          </nut-form-item>
        </view>
        <view class="profile-block">
          <nut-form-item label="职业" prop="job">
            <nut-input
              input-align="right"
              :border="false"
              v-model="state.hobbies"
              placeholder="请选择职业"
              readonly
              @click="() => (drawerController.jobVisible = true)"
            />
          </nut-form-item>
          <nut-form-item label="兴趣爱好" prop="hobbies">
            <nut-input
              input-align="right"
              :border="false"
              v-model="state.job"
              placeholder="请选择兴趣爱好"
              readonly
              @click="() => (drawerController.hobbyVisible = true)"
            />
          </nut-form-item>
          <nut-form-item label="喜欢的类型" prop="likeType">
            <nut-input
              input-align="right"
              :border="false"
              v-model="state.likeType"
              placeholder="请选择喜欢的类型"
              readonly
              @click="() => (drawerController.likeTypeVisible = true)"
            />
          </nut-form-item>
        </view>
      </nut-form>
      <view> hello world </view>

      <nut-action-sheet
        v-model:visible="drawerController.typeVisible"
        :menu-items="optionsController.type"
        @choose="chooseType"
      >
      </nut-action-sheet>
      <nut-action-sheet
        v-model:visible="drawerController.bodyVisible"
        :menu-items="optionsController.type"
        @choose="chooseType"
      >
      </nut-action-sheet>
    </view>
  </nut-config-provider>
</template>

<script lang="ts">
import { reactive } from 'vue';
import Uploader from '../../components/uploader/index.vue';

export default {
  name: 'ProfilePage',
  components: { Uploader },
  setup() {
    const themeVars = reactive({
      darkBackground: '#000000',
      darkBackground2: '#000000',
    });
    const state = reactive({
      nickname: '',
      introduction: '',
      type: '',
      height: '',
      weight: '',
      bodyType: '',
      job: '',
      hobbies: [],
      likeType: [],
      image: [],
    });
    const drawerController = reactive({
      typeVisible: false,
      bodyVisible: false,
      jobVisible: false,
      hobbyVisible: false,
      likeTypeVisible: false,
    });
    const optionsController = reactive({
      type: [
        { value: 'tp', name: 'Tp' },
        { value: 'btm', name: 'Bottom' },
        { value: 'vers', name: 'Vers' },
        { value: 'others', name: 'Others' },
      ],
    });
    const valueForPicker = reactive({
      type: [state.type],
      height: [state.height],
    });

    // const handleClick = (type, msg, cover = false) => {
    //   state.show = true;
    //   state.msg2 = msg;
    //   state.type = type;
    //   state.cover = cover;
    // };
    const chooseType = (item) => {
      console.log('item', item);
      state.type = item.name;
      drawerController.typeVisible = false;
    };
    // const heightFormatter = (value: string) => value + 'cm';
    // const weightFormatter = (value: string) => value + 'kg';

    return {
      state,
      drawerController,
      optionsController,
      valueForPicker,
      themeVars,
      // heightFormatter,
      // weightFormatter,
      chooseType,
    };
  },
};
</script>

<style lang="scss">
.profile {
  .nut-cell-group__wrap {
    padding: 0px;
    margin: 0px;
  }
  background-color: #1d1d1d;
  .nut-grid-item__content {
    padding: 4px 7px;
  }
  .profile-imageset {
    padding: 4px;
    background-color: #1d1d1d;
    .tip {
      position: absolute;
      left: -1px;
      top: -1px;
      font-size: 12px;
      padding: 4px 14px;
      border-top-left-radius: 10px;
      border-bottom-right-radius: 10px;
      background-color: #dbf378;
      color: #000;
      font-weight: bold;
    }

    .nut-cell {
      padding: 13px 0px;
    }
  }
}
.flex {
  display: flex;
}
.profile-block {
  padding-top: 14px;
  background-color: #1d1d1d;
}
</style>
