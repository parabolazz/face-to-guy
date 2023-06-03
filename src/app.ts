import { createApp } from 'vue';
import { createPinia } from 'pinia'
import registerVirtualList from '@tarojs/components-advanced/dist/components/virtual-list/vue'

import './app.scss';
import 'windi.css';
import './theme.css'

const App = createApp({
  // 对应 onShow
  onShow (options) {},
});

// 注册插件
App.use(createPinia())
App.use(registerVirtualList)

export default App;
