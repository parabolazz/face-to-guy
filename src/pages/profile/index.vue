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
              :sizeType="['compressed']"
              :mediaType="['image']"
              url="https://pairs.cc/pairs/uploadImg"
              :headers="{
                Authorization: authToken,
              }"
              @success="onUploadSuccess"
              @delete="onDelete"
              :file-list="state.images"
              :is-preview="false"
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

          <nut-form-item label="体型" prop="shape">
            <nut-input
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

    <nut-action-sheet
      v-model:visible="drawerController.attributeVisible"
      :menu-items="optionsController.attribute as any"
      @choose="chooseType"
    >
    </nut-action-sheet>
    <nut-action-sheet
      v-model:visible="drawerController.bodyVisible"
      :menu-items="optionsController.shape as any"
      @choose="chooseBodyType"
    >
    </nut-action-sheet>
    <nut-popup
      position="bottom"
      v-model:visible="drawerController.carrierVisible"
      style="width: 100%"
      :safe-area-inset-bottom="true"
    >
      <nut-picker
        :columns="optionsController.career"
        title="请选择职业"
        style="width: 100%"
        @confirm="chooseCarrier"
        @cancel="drawerController.carrierVisible = false"
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
    const chooseCarrier = ({ selectedValue }) => {
      console.log('selectedValue', selectedValue, selectedValue[0]);
      state.career = selectedValue[0];
      drawerController.carrierVisible = false;
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
          hobby: state.hobbies.join(','),
          favorite: state.favorite.join(','),
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
        if (!isEditMode.value) {
          global.setActiveTabIndex(0);
          Taro.switchTab({
            url: '/pages/home/index',
          });
        }
        Taro.showToast({
          title: '修改成功',
          icon: 'success',
        });
      } catch (error) {
        Taro.showToast({
          title: '修改失败',
          icon: 'none',
        });
      }
    };
    const onDelete = ({ index }) => {
      state.images.splice(index, 1);
    };

    const onUploadSuccess = (res) => {
      const {
        data: { data: dataText },
      } = res;
      try {
        const resData = JSON.parse(dataText);
        state.images.push({
          status: 'success',
          message: '上传成功',
          type: 'image',
          url: resData.data,
        });
      } catch (error) {
        Taro.showToast({
          title: '上传失败',
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
      console.log('12322', state.hobbies, optionsController.hobbies);
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
      onUploadSuccess,
      onDelete,
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
  .nut-cell-group .nut-cell::after {
    border-bottom: none;
  }
}
.profile-block {
  padding-top: 14px;
  background-color: #1d1d1d;
}
</style>
