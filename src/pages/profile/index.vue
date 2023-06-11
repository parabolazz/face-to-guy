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
            <nut-uploader
              :sizeType="['compressed']"
              :mediaType="['image']"
              url="https://110.41.140.132/pairs/uploadImg"
              :headers="{
                Authorization: authToken,
              }"
              @success="onUploadSuccess"
              v-model:file-list="state.images"
              :is-preview="true"
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
          <nut-form-item label="职业" prop="carrier">
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
        :columns="optionsController.carrier"
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
import { editProfile } from '../../api/user';

export default {
  name: 'ProfilePage',
  setup() {
    const instance = Taro.getCurrentInstance();
    const authToken = ref(Taro.getStorageSync('TOKEN'));

    const themeVars = reactive({
      darkBackground: '#000000',
      darkBackground2: '#000000',
    });
    const state = reactive({
      nickname: '',
      signature: '',
      attribute: undefined as unknown as number,
      height: undefined,
      weight: undefined,
      shape: undefined,
      carrier: undefined,
      hobbies: [] as number[],
      favorite: [] as number[],
      images: [] as {
        url: string;
      }[],
    });
    const drawerController = reactive({
      attributeVisible: false,
      bodyVisible: false,
      carrierVisible: false,
      hobbyVisible: false,
      likeTypeVisible: false,
    });
    const optionsController = {
      attribute: [
        { value: 1, name: 'Tp' },
        { value: 0, name: 'Bottom' },
        { value: 2, name: 'Vers' },
        { value: 3, name: 'Others' },
      ],
      shape: [
        { value: 1, name: '猴' },
        { value: 2, name: '狒狒' },
        { value: 3, name: '熊' },
        { value: 4, name: '肌肉' },
        { value: 5, name: '匀称' },
      ],
      hobbies: [
        { value: 1, text: '运动' },
        { value: 2, text: '创意艺术' },
        { value: 3, text: '音乐' },
        { value: 4, text: '旅游' },
        { value: 5, text: '阅读' },
        { value: 6, text: '写作' },
        { value: 7, text: '游戏' },
        { value: 8, text: '烹饪' },
        { value: 9, text: '健身' },
      ],
      carrier: [
        { value: 1, text: '工业/制造业' },
        { value: 2, text: '自由职业' },
        { value: 3, text: '贸易/零售' },
        { value: 4, text: '教育/科研' },
        { value: 5, text: '专业服务' },
        { value: 6, text: '房地产/建筑' },
        { value: 7, text: '服务业' },
        { value: 8, text: 'IT/ 互联网/ 通信' },
        { value: 9, text: '文化/艺术' },
        { value: 10, text: '学生' },
        { value: 11, text: '广告/营销' },
        { value: 12, text: '影视/娱乐' },
        { value: 13, text: '金融' },
        { value: 14, text: '医药/ 健康/ 健身' },
      ],
      favorite: [
        { value: 1, text: '年上' },
        { value: 2, text: '小鲜肉' },
        { value: 3, text: '肌肉' },
        { value: 4, text: '精瘦' },
        { value: 5, text: '熊熊' },
        { value: 6, text: '斯文' },
        { value: 7, text: '运动系' },
        { value: 8, text: '居家男' },
      ],
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
      state.carrier = selectedValue[0];
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
      const { valid } = await formRef.value.validate();
      if (!valid) {
        return;
      }
      const data = {
        nickname: state.nickname,
        signature: state.signature,
        attribute: state.attribute,
        height: state.height,
        weight: state.weight,
        shape: state.shape,
        carrier: state.carrier,
        hobby: state.hobbies.join(','),
        favorite: state.favorite.join(','),
        avatar_ids: state.images.map((item) => item.url),
      };
      Taro.showToast({
        title: '加载中',
        icon: 'loading',
      });
      await editProfile(data);
      Taro.hideToast();
    };

    const onUploadSuccess = () => {
      console.log('state.images', state.images);
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
      return state.carrier
        ? optionsController.carrier.find((item) => item.value === state.carrier)
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
