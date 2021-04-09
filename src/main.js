import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import CKEditor from '@ckeditor/ckeditor5-vue'
import Axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
// import '../theme/index.css'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css
import '@/icons' // icon
// import '@/assets/mock' //全局引入mockjs会导致接收的服务端blob数据乱码，新闻和通知的编辑器会单独引用这个包
import '@/permission' // permission control
import 'lib-flexible' // 使用lib-flexible来解决移动端适配
// 解决低版本浏览器不支持promise问题
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()

import Api from '@/assets/http/apiUrl'
import Request from '@/assets/http'

Vue.prototype.$axios = Axios
Vue.use(CKEditor)

import AMap from 'vue-amap';
Vue.use(ElementUI, { size: 'small' });
Vue.use(AMap);
AMap.initAMapApiLoader({
  key: '9a0343b609ba238ef075caa01e3467e1',
  plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'AMap.CircleEditor','AMap.Geocoder'],
  uiVersion: '1.0.11'});

Vue.config.productionTip = false
Vue.use(ElementUI, {
  locale
})
Vue.prototype.API = Api
Vue.prototype.$request = Request

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
