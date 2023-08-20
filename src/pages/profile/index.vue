<template>
  <nut-config-provider theme="dark" :theme-vars="themeVars">
    <view class="profile">
      <nut-form :model-value="state" ref="formRef" :rules="rules">
        <view class="profile-imageset">
          <nut-form-item
            prop="images"
            label="照片墙"
            required
            class="profile-form-item__image"
          >
            <Uploader
              :size-type="['compressed']"
              :mediaType="['image']"
              url="https://pairs.cc/pairs/uploadImg"
              :headers="{
                Authorization: authToken,
              }"
              :file-list="state.images"
              :is-preview="false"
              mode="aspectFill"
              @failure="onUploadFailure"
            >
              <template #tip>
                <view class="tip" v-if="state.images.length === 0">头像</view>
              </template>
            </Uploader>
          </nut-form-item>
        </view>
        <view class="profile-block">
          <nut-form-item prop="nickname" label="昵称" required>
            <nut-input
              placeholder-class="placeholder"
              input-align="right"
              :border="false"
              v-model="state.nickname"
              placeholder="请输入昵称"
              type="text"
            />
          </nut-form-item>
          <nut-form-item prop="signature" label="个性签名">
            <nut-textarea
              class="profile-intro-textarea"
              v-model="state.signature"
              placeholder="人生即一场相遇，即使错过也不深究"
              :autosize="{ minHeight: 50, maxHeight: 200 }"
            />
          </nut-form-item>
        </view>
        <view class="profile-block">
          <nut-form-item label="属性" prop="attribute" required>
            <nut-input
              placeholder-class="placeholder"
              input-align="right"
              :border="false"
              v-model="currAttributeName"
              @click="() => (drawerController.attributeVisible = true)"
              readonly
              placeholder="请选择属性"
              type="text"
            />
          </nut-form-item>

          <nut-form-item label="身高" prop="height">
            <view class="flex items-center">
              <nut-input
                placeholder-class="placeholder"
                input-align="right"
                :border="false"
                v-model="state.height"
                format-trigger="onChange"
                placeholder="请输入身高"
                type="digit"
              />
              <span>CM</span>
            </view>
          </nut-form-item>

          <nut-form-item label="体重" prop="weight">
            <view class="flex items-center">
              <nut-input
                placeholder-class="placeholder"
                input-align="right"
                :border="false"
                v-model="state.weight"
                format-trigger="onChange"
                placeholder="请输入体重"
                type="digit"
              />
              <span>KG</span>
            </view>
          </nut-form-item>

          <nut-form-item label="体型" prop="shape">
            <nut-input
              placeholder-class="placeholder"
              input-align="right"
              :border="false"
              v-model="currShapeName"
              placeholder="请选择体型"
              readonly
              @click="() => (drawerController.bodyVisible = true)"
            />
          </nut-form-item>
        </view>
        <view class="profile-block">
          <nut-form-item label="职业" prop="career">
            <nut-input
              placeholder-class="placeholder"
              input-align="right"
              :border="false"
              v-model="currCarrierName"
              placeholder="请选择职业"
              readonly
              @click="() => (drawerController.carrierVisible = true)"
            />
          </nut-form-item>
          <nut-form-item label="兴趣爱好" prop="hobbies">
            <div
              :class="[
                'profile-form-item__value',
                currHobbiesName && 'profile-form-item__value-text',
              ]"
              @click="() => (drawerController.hobbyVisible = true)"
            >
              {{ currHobbiesName || '请选择兴趣爱好' }}
            </div>
          </nut-form-item>
          <nut-form-item label="喜欢的类型" prop="favorite">
            <div
              :class="[
                'profile-form-item__value',
                currFavoritesName && 'profile-form-item__value-text',
              ]"
              @click="() => (drawerController.likeTypeVisible = true)"
            >
              {{ currFavoritesName || '请选择喜欢的类型' }}
            </div>
          </nut-form-item>
        </view>
      </nut-form>
      <view class="profile-submit-btn" @click="onSubmit">{{
        isEditMode ? '修改资料' : '立即进入'
      }}</view>
    </view>

    <nut-popup
      position="bottom"
      v-model:visible="drawerController.attributeVisible"
      style="width: 100%"
      :safe-area-inset-bottom="true"
    >
      <div class="flex justify-end">
        <div
          class="choose-confirm-btn"
          @click="() => (drawerController.attributeVisible = false)"
        >
          确定
        </div>
      </div>
      <picker-view
        indicator-class="profile-picker-indicator"
        style="width: 100%; height: 200px"
        mask-class="profile-picker-mask"
        :value="[currentAttributeIndex]"
        @change="chooseAttribute"
      >
        <picker-view-column>
          <view
            v-for="opt in optionsController.attribute"
            :key="opt.value"
            class="profile-picker-text"
            >{{ opt.name }}</view
          >
        </picker-view-column>
      </picker-view>
    </nut-popup>
    <nut-popup
      position="bottom"
      v-model:visible="drawerController.bodyVisible"
      style="width: 100%"
      :safe-area-inset-bottom="true"
    >
      <div class="flex justify-end">
        <div
          class="choose-confirm-btn"
          @click="() => (drawerController.bodyVisible = false)"
        >
          确定
        </div>
      </div>
      <picker-view
        indicator-class="profile-picker-indicator"
        style="width: 100%; height: 200px"
        mask-class="profile-picker-mask"
        :value="[currentShapeIndex]"
        @change="chooseShape"
      >
        <picker-view-column>
          <view
            v-for="opt in optionsController.shape"
            :key="opt.value"
            class="profile-picker-text"
            >{{ opt.name }}</view
          >
        </picker-view-column>
      </picker-view>
    </nut-popup>
    <nut-popup
      position="bottom"
      v-model:visible="drawerController.carrierVisible"
      style="width: 100%"
      :safe-area-inset-bottom="true"
    >
      <div class="flex justify-end">
        <div
          class="choose-confirm-btn"
          @click="() => (drawerController.carrierVisible = false)"
        >
          确定
        </div>
      </div>
      <picker-view
        indicator-class="profile-picker-indicator"
        style="width: 100%; height: 300px"
        mask-class="profile-picker-mask"
        :value="[currentCarrierIndex]"
        @change="chooseCarrier"
      >
        <picker-view-column>
          <view
            v-for="opt in optionsController.career"
            :key="opt.value"
            class="profile-picker-text"
            >{{ opt.text }}</view
          >
        </picker-view-column>
      </picker-view>
    </nut-popup>
    <nut-popup
      overlay-class="choose-confirm-overlay"
      position="bottom"
      v-model:visible="drawerController.hobbyVisible"
      style="width: 100%"
      :safe-area-inset-bottom="true"
    >
      <div class="flex justify-end">
        <div
          class="choose-confirm-btn"
          @click="() => (drawerController.hobbyVisible = false)"
        >
          确定
        </div>
      </div>
      <!-- 傻逼nut-ui一定要用ref -->
      <nut-checkbox-group v-model="hobbies" :max="3">
        <nut-cell v-for="item in optionsController.hobbies" :key="item.value">
          <nut-checkbox :label="item.value">{{ item.text }}</nut-checkbox>
        </nut-cell>
      </nut-checkbox-group>
    </nut-popup>

    <nut-popup
      overlay-class="choose-confirm-overlay"
      position="bottom"
      v-model:visible="drawerController.likeTypeVisible"
      style="width: 100%"
      :safe-area-inset-bottom="true"
    >
      <div class="flex justify-end">
        <div
          class="choose-confirm-btn"
          @click="() => (drawerController.likeTypeVisible = false)"
        >
          确定
        </div>
      </div>
      <!-- 傻逼nut-ui一定要用ref -->
      <nut-checkbox-group v-model="favorite" :max="3">
        <nut-cell v-for="item in optionsController.favorite" :key="item.value">
          <nut-checkbox :label="item.value">{{ item.text }}</nut-checkbox>
        </nut-cell>
      </nut-checkbox-group>
    </nut-popup>
  </nut-config-provider>
</template>

<script lang="ts">
import { computed, reactive, ref, toRefs } from 'vue';
import Taro from '@tarojs/taro';
import Uploader from '../../components/uploader/index.vue';
import { editProfile, ProfileData } from '../../api/user';
import { useGlobalStore } from '../../store';
import {
  ATTRIBUTE_LIST,
  SHAPE_LIST,
  HOBBY_LIST,
  CARRIER_LIST,
  FAVORITE_LIST,
} from '../../utils/profileEnum';
import { onMounted } from 'vue';
import { watch } from 'vue';

interface FormData {
  nickname: string;
  signature: string;
  attribute: number;
  height?: number;
  weight?: number;
  shape?: number;
  career?: number;
  hobbies: number[];
  favorite: number[];
  images: {
    status: 'success';
    message: '上传成功';
    type: 'image';
    url: string;
  }[];
}

function formatApiDataToFormData(data?: ProfileData): FormData {
  return data
    ? {
        nickname: data.nickname,
        signature: data.signature || '',
        attribute: data.attribute,
        height: data.height,
        weight: data.weight,
        shape: data.shape,
        career: data.career,
        hobbies: data.hobby?.split(',').map((str) => Number(str)) || [],
        favorite: data.favorite?.split(',').map((str) => Number(str)) || [],
        images: data.avatar_ids.map((url) => ({
          url,
          status: 'success',
          message: '上传成功',
          type: 'image',
        })),
      }
    : {
        nickname: '',
        signature: '',
        attribute: undefined as unknown as number,
        height: undefined,
        weight: undefined,
        shape: undefined,
        career: undefined,
        hobbies: [] as number[],
        favorite: [] as number[],
        images: [] as {
          url: string;
        }[],
      };
}

export default {
  name: 'ProfilePage',
  setup() {
    const instance = Taro.getCurrentInstance();
    const authToken = ref(Taro.getStorageSync('TOKEN'));
    const global = useGlobalStore();

    const themeVars = reactive({
      darkBackground: '#000000',
      darkBackground2: '#000000',
    });
    const state = reactive<FormData>(
      formatApiDataToFormData(global.userProfile),
    );
    const drawerController = reactive({
      attributeVisible: false,
      bodyVisible: false,
      carrierVisible: false,
      hobbyVisible: false,
      likeTypeVisible: false,
    });
    const optionsController = {
      attribute: ATTRIBUTE_LIST,
      shape: SHAPE_LIST,
      hobbies: HOBBY_LIST.map((item) => ({
        value: item.value,
        text: item.name,
      })),
      career: CARRIER_LIST.map((item) => ({
        value: item.value,
        text: item.name,
      })),
      favorite: FAVORITE_LIST.map((item) => ({
        value: item.value,
        text: item.name,
      })),
    };
    const isEditMode = computed(() => instance?.router?.params.from);
    const currentCarrierIndex = computed(() => {
      const index = optionsController.career.findIndex(
        (item) => item.value === state.career,
      );
      return index === -1 ? 0 : index;
    });
    const currentAttributeIndex = computed(() => {
      const index = optionsController.attribute.findIndex(
        (item) => item.value === state.attribute,
      );
      return index === -1 ? 0 : index;
    });
    const currentShapeIndex = computed(() => {
      const index = optionsController.shape.findIndex(
        (item) => item.value === state.shape,
      );
      return index === -1 ? 0 : index;
    });
    const valueForPicker = reactive({
      attribute: [state.attribute],
      height: [state.height],
    });
    const formRef = ref();

    const rules = computed(() => ({
      nickname: [
        { required: false, message: '请输入昵称' },
        {
          validator: (str: string) => {
            return str.length >= 2 && str.length <= 15;
          },
          message: '请输入长度在 2 到 15 个字符的昵称',
        },
      ],
      attribute: [{ required: true, message: '请选择属性' }],
      images: [
        {
          validator: (val: string[]) => {
            console.log('val', val);
            return val.length > 0;
          },
          message: '请上传图片',
        },
      ],
    }));
    const likeTypeText = computed(() => {
      return state.favorite.join('，');
    });
    const chooseCarrier = (e) => {
      const index = e.detail.value[0];
      const val = optionsController.career[index];
      state.career = val.value;
    };
    const chooseAttribute = (e) => {
      const index = e.detail.value[0];
      const val = optionsController.attribute[index];
      state.attribute = val.value;
    };
    const chooseShape = (e) => {
      const index = e.detail.value[0];
      const val = optionsController.shape[index];
      state.shape = val.value;
    };
    const chooseType = (item) => {
      console.log('item', item);
      state.attribute = item.value;
      drawerController.attributeVisible = false;
    };

    const chooseBodyType = (item) => {
      console.log('item', item);
      state.shape = item.value;
      drawerController.bodyVisible = false;
    };

    const chooseHobbies = (item) => {
      console.log('item', item);
      state.hobbies = item.value;
      drawerController.hobbyVisible = false;
    };

    const chooseLikeType = (item) => {
      console.log('item', item);
      state.favorite = item.value;
      drawerController.likeTypeVisible = false;
    };
    const onSubmit = async () => {
      try {
        const { valid } = await formRef.value.validate();
        if (!valid) {
          return;
        }
        const data = {
          nickname: state.nickname,
          signature: state.signature,
          attribute: state.attribute,
          height: Number(state.height),
          weight: Number(state.weight),
          shape: state.shape,
          career: state.career,
          hobby: state.hobbies.filter((item) => Number(item) !== 0).join(','),
          favorite: state.favorite
            .filter((item) => Number(item) !== 0)
            .join(','),
          avatar_ids: state.images.map((item) => item.url),
          shot: global.userProfile!.shot,
        };
        Taro.showToast({
          title: '加载中',
          icon: 'loading',
        });
        await editProfile(data);
        await global.getUserProfile();

        Taro.hideToast();
        if (isEditMode.value) {
          Taro.showToast({
            title: '修改成功',
            icon: 'success',
          });
          setTimeout(() => {
            Taro.navigateBack({
              delta: 1,
            });
          }, 500);
        } else {
          global.setActiveTabIndex(0);
          Taro.switchTab({
            url: '/pages/home/index',
          });
        }
      } catch (error) {
        Taro.showToast({
          title: '修改失败',
          icon: 'none',
        });
      }
    };

    const currAttributeName = computed(() => {
      return state.attribute
        ? optionsController.attribute.find(
            (item) => item.value === state.attribute,
          )?.name || ''
        : '';
    });

    const currShapeName = computed(() => {
      return state.shape
        ? optionsController.shape.find((item) => item.value === state.shape)
            ?.name || ''
        : '';
    });

    const currCarrierName = computed(() => {
      return state.career
        ? optionsController.career.find((item) => item.value === state.career)
            ?.text || ''
        : '';
    });

    const currHobbiesName = computed(() => {
      return state.hobbies.length
        ? optionsController.hobbies
            .filter((item) => state.hobbies.includes(item.value))
            .map((item) => item.text)
            .join(', ')
        : '';
    });

    const currFavoritesName = computed(() => {
      return state.favorite.length
        ? optionsController.favorite
            .filter((item) => state.favorite.includes(item.value))
            .map((item) => item.text)
            .join(', ')
        : '';
    });

    const onUploadFailure = (data) => {
      const dataText = data?.data?.data || '';
      if (dataText.includes('451')) {
        Taro.showToast({
          title: '请上传合法图片！',
          icon: 'error',
          duration: 4000,
        });
      } else {
        Taro.showToast({
          title: '上传失败',
          icon: 'error',
        });
      }
    };
    onMounted(() => {
      Taro.getLocation({
        type: 'wgs84',
        success: function (res) {
          console.log('res', res);
        },
      });
    });
    watch(
      () => global.userProfile,
      (newVal) => {
        const newFormData = formatApiDataToFormData(newVal);
        Object.keys(newFormData).forEach((key) => {
          state[key] = newFormData[key];
        });
      },
    );
    watch(
      () => state.images,
      (newVal, oldVal) => {
        console.log('newVal oldVal', newVal, oldVal);
      },
      { deep: true },
    );
    return {
      state,
      ...toRefs(state),
      drawerController,
      optionsController,
      valueForPicker,
      themeVars,
      chooseCarrier,
      rules,
      formRef,
      likeTypeText,
      isEditMode,
      authToken,
      chooseType,
      chooseBodyType,
      chooseHobbies,
      chooseLikeType,
      onSubmit,
      currAttributeName,
      currShapeName,
      currHobbiesName,
      currFavoritesName,
      currCarrierName,
      currentCarrierIndex,
      chooseAttribute,
      currentAttributeIndex,
      currentShapeIndex,
      chooseShape,
      onUploadFailure,
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
    padding: 20px 0px 30px;
    z-index: 10;
    background-color: #dbf378;
    flex: 1;
    display: flex;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    color: #000;
  }
  .profile-intro-textarea {
    padding: 2px;
    text-align: right !important;
  }
  .nut-cell-group .nut-cell::after {
    border-bottom: none;
  }
  .nut-form-item__label {
    color: #dbf378;
  }
}
.profile-block {
  padding-top: 14px;
  background-color: #141414;
}
.choose-confirm-btn {
  display: inline-block;
  margin: 12px 12px 0 0;
  color: #dbf378;
  padding: 2px 4px;
  font-weight: bold;
}

.profile-picker-mask {
  max-width: auto;
  background: rgb(0, 240, 244);
  background: linear-gradient(
    0deg,
    rgba(50, 50, 50, 1) 0%,
    rgba(50, 50, 50, 0.5) 20%,
    rgba(98, 98, 98, 0.1) 45%,
    rgba(98, 98, 98, 0.1) 55%,
    rgba(50, 50, 50, 0.5) 80%,
    rgba(50, 50, 50, 1) 100%
  );
  background-size: 750px 300px !important;
  background-position: center center;
  background-repeat: no-repeat;
  z-index: 9;
}
.profile-picker-indicator {
  color: #fff;
}
.profile-picker-text {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
.nut-theme-dark .nut-popup {
  background-color: #323232;
}
</style>
