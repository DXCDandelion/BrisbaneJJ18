// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App'

Vue.config.productionTip = false

Vue.use(Vuetify)

import moment from 'moment'
Vue.prototype.moment = moment

import Storage from 'vue-ls'
const options = {
  namespace: 'dburndown__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local', // storage name session, local, memory
}
Vue.use(Storage, options)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
