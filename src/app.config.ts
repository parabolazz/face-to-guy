export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/home/index',
    'pages/chats/index',
    'pages/login/index',
    'pages/me/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  "tabBar": {
    "color":"#333",
    "selectedColor":"#999",
    "list": [{
      "pagePath": "pages/index/index",
      "text": "派对"
    }, {
      "pagePath": "pages/chats/index",
      "text": "消息"
    },  {
      "pagePath": "pages/me/index",
      "text": "我的"
    }]
  },
})
