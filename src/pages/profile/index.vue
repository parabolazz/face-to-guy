<template>
  <nut-config-provider theme="dark" :theme-vars="themeVars">
    <view class="profile">
      <nut-form :model-value="state" ref="formRef" :rules="rules">
        <view class="profile-imageset">
          <nut-form-item
            prop="image"
            label="照片墙"
            required
            class="profile-form-item__image"
          >
            <nut-uploader
              :sizeType="['compressed']"
              :mediaType="['image']"
              url="https://110.41.140.132/pairs/uploadImg"
              :headers="{
                Authorization: authToken,
              }"
              v-model:file-list="state.images"
              :is-preview="false"
            >
              <template #tip>
                <view class="tip" v-if="state.images.length === 0">头像</view>
              </template>
            </nut-uploader>
          </nut-form-item>
        </view>
        <view class="profile-block">
          <nut-form-item prop="nickname" label="昵称" required>
            <nut-input
              input-align="right"
              :border="false"
              v-model="state.nickname"
              placeholder="请输入昵称"
              type="text"
            />
          </nut-form-item>
          <nut-form-item prop="introduction" label="个性签名">
            <nut-textarea
              class="profile-intro-textarea"
              v-model="state.introduction"
              placeholder="人生即一场相遇，即使错过也不深究"
              :autosize="{ minHeight: 50, maxHeight: 200 }"
            />
          </nut-form-item>
        </view>
        <view class="profile-block">
          <nut-form-item label="属性" prop="type" required>
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
              v-model="state.job"
              placeholder="请选择职业"
              readonly
              @click="() => (drawerController.jobVisible = true)"
            />
          </nut-form-item>
          <nut-form-item label="兴趣爱好" prop="hobbies">
            <div
              :class="[
                'profile-form-item__value',
                hobbyText && 'profile-form-item__value-text',
              ]"
              @click="() => (drawerController.hobbyVisible = true)"
            >
              {{ hobbyText || '请选择兴趣爱好' }}
            </div>
          </nut-form-item>
          <nut-form-item label="喜欢的类型" prop="likeType">
            <div
              :class="[
                'profile-form-item__value',
                likeTypeText && 'profile-form-item__value-text',
              ]"
              @click="() => (drawerController.likeTypeVisible = true)"
            >
              {{ likeTypeText || '请选择喜欢的类型' }}
            </div>
          </nut-form-item>
        </view>
      </nut-form>
      <view v-if="isEditMode" class="profile-submit-btn">修改</view>
      <view v-else class="profile-submit-btn" @click="onSubmit">立即进入</view>
    </view>

    <nut-action-sheet
      v-model:visible="drawerController.typeVisible"
      :menu-items="optionsController.type as any"
      @choose="chooseType"
    >
    </nut-action-sheet>
    <nut-action-sheet
      v-model:visible="drawerController.bodyVisible"
      :menu-items="optionsController.bodyType as any"
      @choose="chooseBodyType"
    >
    </nut-action-sheet>
    <nut-popup
      position="bottom"
      v-model:visible="drawerController.jobVisible"
      style="width: 100%"
      :safe-area-inset-bottom="true"
    >
      <nut-picker
        :columns="optionsController.job"
        title="请选择职业"
        style="width: 100%"
        @confirm="confirm"
        @cancel="drawerController.jobVisible = false"
      >
      </nut-picker>
    </nut-popup>
    <nut-popup
      position="bottom"
      v-model:visible="drawerController.hobbyVisible"
      style="width: 100%"
      :safe-area-inset-bottom="true"
    >
      <!-- 傻逼nut-ui一定要用ref -->
      <nut-checkbox-group v-model="hobbies" :max="3">
        <nut-cell v-for="item in optionsController.hobbies" :key="item.value">
          <nut-checkbox :label="item.value">{{ item.text }}</nut-checkbox>
        </nut-cell>
      </nut-checkbox-group>
    </nut-popup>

    <nut-popup
      position="bottom"
      v-model:visible="drawerController.likeTypeVisible"
      style="width: 100%"
      :safe-area-inset-bottom="true"
    >
      <!-- 傻逼nut-ui一定要用ref -->

      <nut-checkbox-group v-model="likeType" :max="3">
        <nut-cell v-for="item in optionsController.likeType" :key="item.value">
          <nut-checkbox :label="item.value">{{ item.text }}</nut-checkbox>
        </nut-cell>
      </nut-checkbox-group>
    </nut-popup>
  </nut-config-provider>
</template>

<script lang="ts">
import { computed, reactive, ref, toRefs } from 'vue';
import Taro from '@tarojs/taro';

export default {
  name: 'ProfilePage',
  setup() {
    const instance = Taro.getCurrentInstance();
    const authToken = ref(Taro.getStorageSync('TOKEN'));
    console.log('authToken', authToken);
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
      images: [
        {
          name: '文件1.png',
          url: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
          status: 'success',
          message: '上传成功',
          type: 'image',
        },
      ],
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
      bodyType: [
        { value: '猴', name: '猴' },
        { value: '狒狒', name: '狒狒' },
        { value: '熊', name: '熊' },
        { value: '肌肉', name: '肌肉' },
        { value: '匀称', name: '匀称' },
      ],
      hobbies: [
        { value: '创意艺术 ', text: '创意艺术 ' },
        { value: '音乐', text: '音乐' },
        { value: '旅游', text: '旅游' },
        { value: '阅读', text: '阅读' },
        { value: '写作 ', text: '写作 ' },
        { value: '游戏', text: '游戏' },
        { value: '烹饪 ', text: '烹饪 ' },
        { value: '健身 ', text: '健身 ' },
      ],
      job: [
        { value: '工业/制造业', text: '工业/制造业' },
        { value: '自由职业', text: '自由职业' },
        { value: '贸易/零售', text: '贸易/零售' },
        { value: '教育/科研', text: '教育/科研' },
        { value: '专业服务', text: '专业服务' },
        { value: '房地产/建筑', text: '房地产/建筑' },
        { value: '服务业', text: '服务业' },
        { value: 'IT/ 互联网/ 通信', text: 'IT/ 互联网/ 通信' },
        { value: '文化/艺术', text: '文化/艺术' },
        { value: '学生', text: '学生' },
        { value: '广告/ 营销', text: '广告/ 营销' },
        { value: '影视/ 娱乐', text: '影视/ 娱乐' },
        { value: '金融', text: '金融' },
        { value: '医药/ 健康/ 健身', text: '医药/ 健康/ 健身' },
      ],
      likeType: [
        { value: '年上', text: '年上' },
        { value: '小鲜肉', text: '小鲜肉' },
        { value: '肌肉', text: '肌肉' },
        { value: '精瘦', text: '精瘦' },
        { value: '熊熊', text: '熊熊' },
        { value: '斯文', text: '斯文' },
        { value: '运动系', text: '运动系' },
        { value: '居家男', text: '居家男' },
      ],
    });
    const isEditMode = computed(() => instance?.router?.params.from);

    const valueForPicker = reactive({
      type: [state.type],
      height: [state.height],
    });
    const formRef = ref();

    const rules = computed(() => ({
      nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        {
          regex: /^\w{2,20}$/,
          message: '昵称长度在 2 到 15 个字符',
          trigger: 'blur',
        },
      ],
      type: [{ required: true, message: '请选择属性', trigger: 'change' }],
      images: [{ required: true, message: '请上传图片', trigger: 'change' }],
    }));
    const hobbyText = computed(() => {
      return state.hobbies.join('，');
    });
    const likeTypeText = computed(() => {
      return state.likeType.join('，');
    });
    const confirm = ({ selectedValue }) => {
      state.job = selectedValue;
      drawerController.jobVisible = false;
    };
    const chooseType = (item) => {
      console.log('item', item);
      state.type = item.name;
      drawerController.typeVisible = false;
    };

    const chooseBodyType = (item) => {
      console.log('item', item);
      state.bodyType = item.name;
      drawerController.bodyVisible = false;
    };

    const chooseHobbies = (item) => {
      console.log('item', item);
      state.hobbies = item.name;
      drawerController.hobbyVisible = false;
    };

    const chooseLikeType = (item) => {
      console.log('item', item);
      state.likeType = item.name;
      drawerController.likeTypeVisible = false;
    };
    const onSubmit = async () => {
      const res = await formRef.value.validate();
      console.log('res', res);
    };
    // const heightFormatter = (value: string) => value + 'cm';
    // const weightFormatter = (value: string) => value + 'kg';

    return {
      state,
      ...toRefs(state),
      drawerController,
      optionsController,
      valueForPicker,
      themeVars,
      confirm,
      rules,
      formRef,
      hobbyText,
      likeTypeText,
      isEditMode,
      authToken,
      // heightFormatter,
      // weightFormatter,
      chooseType,
      chooseBodyType,
      chooseHobbies,
      chooseLikeType,
      onSubmit,
    };
  },
};
</script>

<style lang="scss">
.profile {
  padding-bottom: 100px;
  .nut-cell-group__wrap {
    padding: 0px;
    margin: 0px;
  }
  background-color: #000000;
  .nut-grid-item__content {
    padding: 4px 7px;
  }
  .profile-form-item__image {
    display: flex;
    flex-direction: column;
  }
  .profile-form-item__value {
    flex: 1;
    text-align: right;
    color: #808080;
  }
  .profile-form-item__value-text {
    color: #fff;
  }
  .nut-form-item__body__tips {
    text-align: right;
  }

  .nut-uploader {
    padding: 13px 0 5px;
    &__upload {
      position: relative;
      background: transparent;
      // width: 100%;
      // height: 100%;
      border: 1px dashed #d9d9d9;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.list {
      }
    }
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
      padding: 13px 16px;
    }
  }
  .profile-submit-btn {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 72px;
    z-index: 1;
    background-color: #dbf378;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    color: #000;
  }
  .profile-intro-textarea {
    padding: 2px;
    text-align: right !important;
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
