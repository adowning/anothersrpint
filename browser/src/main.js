import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import * as store  from './store'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VeeValidate from 'vee-validate';
import './plugins/axios'
import './plugins/store-tokens'
import './plugins/vee-validate'
import './plugins/vue-leaflet'
import './plugins/vuex-geolocation'
import './plugins/web-sockets'
import isOnline from 'is-online'
// Check if the user has Internet Connection
isOnline().then(online => { 
	if (online) {
		console.log('There is internet connection')
	}
  })
Vue.use(VeeValidate);

var minimongo = require("minimongo");

var LocalDb = minimongo.MemoryDb;

// Create local db (in memory database with no backing)
var db = new LocalDb();

// Add a collection to the database
db.addCollection("animals");

var doc = { species: "dog", name: "Bingo" };

// Always use upsert for both inserts and modifies
db.animals.upsert(doc, function() {
	// Success:

	// Query dog (with no query options beyond a selector)
	db.animals.findOne({ species:"dog" }, {}, function(res) {
		console.log("Dog's name is: " + res.name);
	});
});
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
