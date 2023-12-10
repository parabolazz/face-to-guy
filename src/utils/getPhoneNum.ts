import Taro from "@tarojs/taro";
import { login } from "../api/user";

const getPhoneNumber = async (e: any, needRedirect) => {
  if (e.detail.code) {
    console.log('phone number code', e.detail.code);
    try {
      const res = await login({
        code: e.detail.code,
      });
      Taro.showToast({
        title: '登录成功',
        icon: 'none',
      });
      Taro.setStorageSync('TOKEN', res?.data.token);
      Taro.setStorageSync('USER_ID', res?.data.user_id);
      global.getUserProfile();
      global.fetchIfMsgRead();
      //跳转到信息填写页
      if(needRedirect){
        res?.data.is_new
          ? Taro.navigateTo({
              url: '/pages/profile/index',
            })
          : Taro.navigateBack();
      }
      return res.data
    } catch (error) {
      console.log('login error', error);
    }
  } else {
    Taro.showToast({
      title: '获取手机号失败',
      icon: 'none',
    });
  }
};

export default getPhoneNumber;