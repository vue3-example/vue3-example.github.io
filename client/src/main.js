import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import mixins from './mixins';
import BootstrapVue3 from 'bootstrap-vue-3';

// Optional, since every component import their Bootstrap functionality
// the following line is not necessary
// import 'bootstrap'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

createApp(App).use(store).use(router).mixin(mixins).use(BootstrapVue3).mount('#app');

window.Kakao.init('12ecc1a13dbe01f4abcde8e95d9657af');
