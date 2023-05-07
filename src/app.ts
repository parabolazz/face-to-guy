import { createApp } from 'vue';
import { createPinia } from 'pinia'

import './app.scss';
import 'windi.css';

const App = createApp({});

// 注册插件
App.use(createPinia())

export default App;
