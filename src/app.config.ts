export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/profile/index',
    'pages/chats/index',
    'pages/login/index',
    'pages/me/index',
    'pages/share/index',
  ],
  window: {
    navigationBarBackgroundColor: '#000000',
    navigationBarTextStyle: 'white',
    backgroundColor: '#000000',
    backgroundTextStyle: 'light',
  },
  initialRenderingCache: "dynamic",
  tabBar: {
    color: '#FFFFFF',
    selectedColor: '#C5DA6E',
    backgroundColor: '#2C2C2C',
    custom: true,
    list: [
      {
        /** 页面路径，必须在 pages 中先定义 */
        pagePath: 'pages/home/index',
        /** tab 上按钮文字 */
        text: '摇人',
        /** 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，当 position 为 top 时，此参数无效，不支持网络图片 */
        iconPath: 'assets/images/party_selected.png',
        /** 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px ，当 position 为 top 时，此参数无效 */
        selectedIconPath: 'assets/images/party_selected.png',
      },
      {
        pagePath: 'pages/chats/index',
        text: '消息',
        iconPath: 'assets/images/message.png',
        selectedIconPath: 'assets/images/message.png',
      },
      {
        pagePath: 'pages/me/index',
        text: '我的',
        iconPath: 'assets/images/me.png',
        selectedIconPath: 'assets/images/me.png',
      },
    ],
  },
});
