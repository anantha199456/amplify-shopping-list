import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

// import all the libraries and dependencies
import Amplify, * as AmplifyModules from "aws-amplify";
import { AmplifyPlugin } from "aws-amplify-vue";
import awsconfig from "./aws-exports";

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
// you may use Bootstrap’ s ready - to - use css by simply adding this line to your project’ s entry point
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Amplify.configure(awsconfig);

// configure vue to use plugins and modules
Vue.use(AmplifyPlugin, AmplifyModules);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);


new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");