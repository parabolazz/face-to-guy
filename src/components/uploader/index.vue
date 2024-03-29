<template>
  <view class="nut-uploader">
    <view class="nut-uploader__slot" v-if="$slots.default">
      <slot></slot>
      <template v-if="Number(maximum) - fileList.length">
        <button class="nut-uploader__input" />
      </template>
    </view>

    <view
      class="nut-uploader__preview"
      :class="[listType]"
      v-for="(item, index) in fileList"
      :key="item.uid"
    >
      <view
        class="nut-uploader__preview-img"
        v-if="listType == 'picture' && !$slots.default"
      >
        <view
          class="nut-uploader__preview__progress"
          v-if="item.status != 'success'"
        >
          <template v-if="item.status != 'ready'">
            <Failure color="#fff" v-if="item.status == 'error'" />
            <Loading name="loading" color="#fff" v-else />
          </template>
          <view class="nut-uploader__preview__progress__msg">{{
            item.message
          }}</view>
        </view>

        <view class="close" v-if="isDeletable" @click="onDelete(item, index)">
          <slot name="delete-icon"> <Failure /></slot>
        </view>

        <img
          class="nut-uploader__preview-img__c"
          :mode="mode"
          @click="fileItemClick(item)"
          v-if="
            (item?.type?.includes('image') || item?.type?.includes('video')) &&
            item.url
          "
          :src="item.url"
        />
        <view v-else class="nut-uploader__preview-img__file">
          <view
            class="nut-uploader__preview-img__file__name"
            @click="fileItemClick(item)"
          >
          </view>
        </view>
        <view class="tips">{{ item.name }}</view>
      </view>
    </view>
    <view
      class="nut-uploader__upload"
      :class="[listType]"
      v-if="
        listType == 'picture' &&
        !$slots.default &&
        Number(maximum) - fileList.length
      "
    >
      <slot name="upload-icon">
        <Photograph color="#808080" />
      </slot>
      <nut-button
        :open-type="isAvatar ? 'chooseAvatar' : undefined"
        @chooseavatar="chooseAvatar"
        @click="chooseImage"
        class="nut-uploader__input"
        :class="{ disabled }"
      />
    </view>
  </view>
</template>

<script lang="ts">
import { PropType, reactive, ref, watch } from 'vue';
import { UploaderTaro, UploadOptions } from './uploader';
import { FileItem, MediaType, SizeType, SourceType } from './type';
import Taro from '@tarojs/taro';
import { Photograph, Failure, Loading, Del, Link } from '@nutui/icons-vue-taro';
export default {
  components: {
    Photograph,
    Failure,
    Loading,
    Del,
    Link,
  },
  props: {
    name: { type: String, default: 'file' },
    url: { type: String, default: '' },
    isAvatar: { type: Boolean, default: false },
    sizeType: {
      type: Array as PropType<SizeType[]>,
      default: () => ['original', 'compressed'],
    },
    sourceType: {
      type: Array as PropType<SourceType[]>,
      default: () => ['album', 'camera'],
    },
    mediaType: {
      type: Array as PropType<MediaType[]>,
      default: () => ['image', 'video', 'mix'],
    },
    camera: {
      type: String,
      default: 'back',
    },

    timeout: { type: [Number, String], default: 1000 * 30 },
    // defaultFileList: { type: Array, default: () => new Array<FileItem>() },
    fileList: { type: Array<any>, default: () => [] },
    isPreview: { type: Boolean, default: true },
    // picture、list
    listType: { type: String, default: 'picture' },
    isDeletable: { type: Boolean, default: true },
    method: { type: String, default: 'post' },
    capture: { type: Boolean, default: false },
    maximize: { type: [Number, String], default: Number.MAX_VALUE },
    maximum: { type: [Number, String], default: 9 },
    clearInput: { type: Boolean, default: true },
    accept: { type: String, default: '*' },
    headers: { type: Object, default: {} },
    data: { type: Object, default: {} },
    xhrState: { type: [Number, String], default: 200 },
    multiple: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    autoUpload: { type: Boolean, default: true },
    maxDuration: { type: Number, default: 10 },
    beforeXhrUpload: {
      type: Function,
      default: null,
    },
    beforeDelete: {
      type: Function,
      default: () => {
        return true;
      },
    },
    onChange: { type: Function },
    mode: {
      type: String,
      default: 'aspectFill',
    },
  },
  emits: [
    'start',
    'progress',
    'oversize',
    'success',
    'failure',
    'change',
    'delete',
    'update:fileList',
    'file-item-click',
  ],
  setup(props, { emit }) {
    const fileList = ref(props.fileList as Array<FileItem>);
    const uploadQueue = ref<Promise<UploaderTaro>[]>([]);

    watch(
      () => props.fileList,
      () => {
        fileList.value = props.fileList;
      },
    );

    const chooseAvatar = (e: any) => {
      const detail = e.detail;

      if (detail?.avatarUrl) {
        Taro.uploadFile({
          url: props.url,
          filePath: detail.avatarUrl,
          name: props.name,
          header: props.headers,
          success: (res) => {
            const { data: dataText } = res;
            const dataObj = JSON.parse(dataText);
            if (dataObj.data) {
              const fileItem = reactive(new FileItem());
              fileItem.url = dataObj.data;
              fileItem.status = 'success';
              fileItem.message = 'success';
              fileList.value.push(fileItem);
              emit('update:fileList', fileList.value);
              emit('success', {
                data: {
                  data: dataObj.data,
                },
              });
              emit('change', {
                fileList: fileList.value,
              });
            } else {
              emit('failure', res);
            }
          },
          fail: (res) => {
            emit('failure', res);
          },
        });
      }
    };

    const chooseImage = () => {
      if (props.disabled || props.isAvatar) {
        return;
      }

      if (Taro.getEnv() == 'WEB') {
        let el = document.getElementById('taroChooseImage');
        if (el) {
          el?.setAttribute('accept', props.accept);
        } else {
          const obj = document.createElement('input');
          obj.setAttribute('type', 'file');
          obj.setAttribute('id', 'taroChooseImage');
          obj.setAttribute('accept', props.accept);
          obj.setAttribute(
            'style',
            'position: fixed; top: -4000px; left: -3000px; z-index: -300;',
          );
          document.body.appendChild(obj);
        }
      }
      // if (Taro.getEnv() == 'WEAPP') {
      //   // chooseMedia 目前只支持微信小程序原生，其余端全部使用 chooseImage API
      //   Taro.chooseMedia({
      //     /** 最多可以选择的文件个数 */
      //     count: props.multiple
      //       ? Number(props.maximum) - fileList.value.length
      //       : 1,
      //     /** 文件类型 */
      //     mediaType: props.mediaType as any,
      //     /** 图片和视频选择的来源 */
      //     sourceType: props.sourceType,
      //     /** 拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 30s 之间 */
      //     maxDuration: props.maxDuration,
      //     /** 仅对 mediaType 为 image 时有效，是否压缩所选文件 */
      //     sizeType: props.sizeType,
      //     /** 仅在 sourceType 为 camera 时生效，使用前置或后置摄像头 */
      //     camera: props.camera,
      //     /** 接口调用失败的回调函数 */
      //     fail: (res: TaroGeneral.CallbackResult) => {
      //       emit('failure', res);
      //     },
      //     /** 接口调用成功的回调函数 */
      //     success: onChangeMedia,
      //   });
      // } else {
      Taro.chooseImage({
        // 选择数量
        count: props.multiple
          ? Number(props.maximum) - fileList.value.length
          : 1,
        // 可以指定是原图还是压缩图，默认二者都有
        sizeType: props.sizeType,
        sourceType: props.sourceType,
        success: onChangeImage,
        fail: (res: any) => {
          emit('failure', res);
        },
      });
      // }
    };

    // const onChangeMedia = (res: Taro.chooseMedia.SuccessCallbackResult) => {
    //   // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    //   const { tempFiles } = res;
    //   console.log('tempFiles', tempFiles);

    //   const _files: Taro.chooseMedia.ChooseMedia[] =
    //     filterFiles<Taro.chooseMedia.ChooseMedia>(tempFiles);
    //   readFile<Taro.chooseMedia.ChooseMedia>(_files);
    //   emit('change', {
    //     fileList: fileList.value,
    //   });
    // };
    const onChangeImage = (res: Taro.chooseImage.SuccessCallbackResult) => {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      const { tempFiles } = res;
      const _files: Taro.chooseImage.ImageFile[] =
        filterFiles<Taro.chooseImage.ImageFile>(tempFiles);
      readFile<Taro.chooseImage.ImageFile>(_files);
      emit('change', {
        fileList: fileList.value,
      });
    };

    const fileItemClick = (fileItem: FileItem) => {
      emit('file-item-click', { fileItem });
    };

    const executeUpload = (fileItem: FileItem, index: number) => {
      const uploadOption = new UploadOptions();
      uploadOption.name = props.name;
      uploadOption.url = props.url;
      uploadOption.fileType = fileItem.type;
      uploadOption.formData = fileItem.formData;
      uploadOption.timeout = (props.timeout as number) * 1;
      uploadOption.method = props.method;
      uploadOption.xhrState = props.xhrState as number;
      uploadOption.method = props.method;
      uploadOption.headers = props.headers;
      uploadOption.taroFilePath = fileItem.path;
      uploadOption.beforeXhrUpload = props.beforeXhrUpload;
      uploadOption.onStart = (option: UploadOptions) => {
        fileItem.status = 'ready';
        fileItem.message = 'readyUpload';
        clearUploadQueue(index);
        emit('start', option);
      };
      uploadOption.onProgress = (event: any, option: UploadOptions) => {
        fileItem.status = 'uploading';
        fileItem.message = 'uploading';
        fileItem.percentage = event.progress;
        emit('progress', { event, option, percentage: fileItem.percentage });
      };

      uploadOption.onSuccess = (
        data: Taro.uploadFile.SuccessCallbackResult,
        option: UploadOptions,
      ) => {
        fileItem.status = 'success';
        fileItem.message = 'success';
        try {
          const { data: dataText } = data;
          const dataObj = JSON.parse(dataText);
          if (dataObj.data) {
            fileItem.url = dataObj.data;
            emit('success', {
              data,
              responseText: data,
              option,
              fileItem,
            });
            emit('update:fileList', fileList.value);
          } else {
            throw new Error('上传失败');
          }
        } catch (error) {
          uploadOption.onFailure?.(data, option);
        }
      };
      uploadOption.onFailure = (
        data: Taro.uploadFile.SuccessCallbackResult,
        option: UploadOptions,
      ) => {
        fileItem.status = 'error';
        fileItem.message = 'error';
        emit('failure', {
          data,
          responseText: data,
          option,
          fileItem,
        });
      };
      let task = new UploaderTaro(uploadOption);
      if (props.autoUpload) {
        task.uploadTaro(Taro.uploadFile, Taro.getEnv());
      } else {
        uploadQueue.value.push(
          new Promise((resolve) => {
            resolve(task);
          }),
        );
      }
    };

    const clearUploadQueue = (index = -1) => {
      if (index > -1) {
        uploadQueue.value.splice(index, 1);
      } else {
        uploadQueue.value = [];
        fileList.value = [];
        emit('update:fileList', fileList.value);
      }
    };
    const submit = () => {
      Promise.all(uploadQueue.value).then((res) => {
        res.forEach((i) => i.uploadTaro(Taro.uploadFile, Taro.getEnv()));
      });
    };
    interface TFileType {
      size: number;
      type?: string;
      fileType?: string;
      originalFileObj?: any;
      tempFilePath?: string;
      thumbTempFilePath?: string;
      path?: string;
    }
    const readFile = <T extends TFileType>(files: T[]) => {
      files.forEach((file: T, index: number) => {
        let fileType = file.type;
        let filepath = (file.tempFilePath || file.path) as string;
        const fileItem = reactive(new FileItem());
        if (file.fileType) {
          fileType = file.fileType;
        } else {
          const imgReg = /\.(png|jpeg|jpg|webp|gif)$/i;
          if (
            !fileType &&
            (imgReg.test(filepath) || filepath.includes('data:image'))
          ) {
            fileType = 'image';
          }
        }

        fileItem.path = filepath;
        fileItem.name = filepath;
        fileItem.status = 'ready';
        fileItem.message = 'waitingUpload';
        fileItem.type = fileType;
        if (Taro.getEnv() == 'WEB') {
          const formData = new FormData();
          for (const [key, value] of Object.entries(props.data)) {
            formData.append(key, value);
          }
          formData.append(props.name, file.originalFileObj as Blob);
          fileItem.name = file.originalFileObj?.name;
          fileItem.type = file.originalFileObj?.type;
          fileItem.formData = formData;
        } else {
          fileItem.formData = props.data;
        }
        if (props.isPreview) {
          fileItem.url =
            fileType == 'video' ? file.thumbTempFilePath : filepath;
        }
        fileList.value.push(fileItem);
        executeUpload(fileItem, index);
      });
    };

    const filterFiles = <T extends TFileType>(files: T[]) => {
      const maximum = (props.maximum as number) * 1;
      const maximize = (props.maximize as number) * 1;
      const oversizes = new Array<T>();
      files = files.filter((file: T) => {
        if (file.size > maximize) {
          oversizes.push(file);
          return false;
        } else {
          return true;
        }
      });
      if (oversizes.length) {
        emit('oversize', oversizes);
      }
      let currentFileLength = files.length + fileList.value.length;
      if (currentFileLength > maximum) {
        files.splice(files.length - (currentFileLength - maximum));
      }
      return files;
    };

    const deleted = (file: FileItem, index: number) => {
      fileList.value.splice(index, 1);
      emit('delete', {
        file,
        fileList: fileList.value,
        index,
      });
    };

    const onDelete = (file: FileItem, index: number) => {
      clearUploadQueue(index);
      deleted(file, index);
      // funInterceptor(props.beforeDelete, {
      //   args: [file, fileList.value],
      //   done: () => deleted(file, index),
      // });
    };

    return {
      onDelete,
      fileList,
      chooseImage,
      chooseAvatar,
      fileItemClick,
      clearUploadQueue,
      submit,
    };
  },
};
</script>
<style lang="scss">
.nut-theme-dark {
  .nut-uploader__preview-list {
    background: $dark-background2;
    color: $dark-color;
  }
  .close {
    color: $dark-color !important;
  }
}
.nut-uploader {
  position: relative;
  display: flex;
  flex-wrap: wrap;

  &__slot {
    position: relative;
  }

  &__upload {
    position: relative;
    background: $uploader-background;
    width: $uploader-picture-width;
    height: $uploader-picture-height;
    display: flex;
    align-items: center;
    justify-content: center;

    &.list {
    }
  }

  &__input {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden;
    cursor: pointer !important;
    opacity: 0;
    &:disabled,
    &.disabled {
      cursor: not-allowed !important;
    }
  }

  &__preview.picture:nth-child(3n + 2) {
    flex: 1;
  }

  &__preview {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px 0 rgb(0 0 0 / 10%);
    // 第二个撑满

    &__progress {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &__msg {
        color: $white;
        font-size: 12px;
        margin-top: 6px;
      }
    }
    &.list {
      width: 100%;
      margin-right: 0px;
      margin-bottom: 0px;
      margin-top: 10px;
    }
    &-list {
      width: 100%;
      height: 32px;
      display: flex;
      flex-direction: column;
      position: relative;
      .nut-uploader__preview-img__file__name {
        padding: 2px 4px;
        display: flex;
        align-items: center;
        height: 100%;
        .file__name_tips {
          margin-left: 4px;
          padding: 0 20px;
          @include oneline-ellipsis();
        }
      }

      .nut-uploader__preview-img__file__del {
        position: absolute;
        right: 6px;
        top: 6px;
      }
      .nut-uploader__preview-img__file__link {
        position: absolute;
        left: 6px;
        top: 8px;
      }
      .nut-progress {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        .nut-progress-outer {
          height: 2px !important;
        }
      }
    }
    &-img {
      position: relative;
      width: $uploader-picture-width;
      height: $uploader-picture-height;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      .close {
        position: absolute;
        right: 0;
        top: 0;
        color: rgba(0, 0, 0, 0.6);
        transform: translate(50%, -50%);
        z-index: 12;
      }
      .tips {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: $white;
        height: 0px;
        transition: height 0.3s;
        background: rgba(0, 0, 0, 0.54);
        @include oneline-ellipsis();
      }
      &__c {
        max-width: 100%;
        max-height: 100%;
        border-radius: 6px;
      }
      &__file {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;

        &__name {
          display: flex;
          width: 100%;
          font-size: 12px;
          color: $text-color;
          padding: 10px;
          height: 100%;
          overflow: hidden;
          box-sizing: border-box;
          align-items: center;
          &.error {
            color: red !important;
          }
          &.success {
            color: #1890ff !important;
          }
        }
      }
    }
  }
}
</style>
