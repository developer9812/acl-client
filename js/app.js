import Vue from 'vue';
import axios from 'axios';
import Vuex from 'vuex';
import _ from 'lodash';
import store from './store';

// window.Vue = Vue;
// window.axios = axios;
window.Role = [];

const url = 'http://192.168.1.60:81'

Vue.directive('can', {
  bind: function (el, binding, vnode) {
    if (Role.length == 0) {
      	const comment = document.createComment(' ');
      	vnode.elm = comment;
      	vnode.isComment = true;
      	console.log(vnode);
        console.log("ROLE");
        console.log(Role);
        return;
    }
    // let permissions = Role[0].permissions;
    let permissions = store.getters.permissions;
    if (permissions == null || permissions.length == 0) {
      	const comment = document.createComment(' ');
      	vnode.elm = comment;
      	vnode.isComment = true;
      	console.log(vnode);
        console.log("PERMISSIONS");
        console.log(permissions);
        return;
    }
    let status = _.some(permissions, ['name', binding.value]);
    console.log("STATUS");
    console.log(status);
    if (!status) {
    	const comment = document.createComment(' ');
    	vnode.elm = comment;
    	vnode.isComment = true;
    	console.log(vnode);
    } else {
    }
  }
});


var vm = new Vue({
  el: '#app',
  data: {
    form: {
      username: '',
      password: ''
    },
    authValid: false,
    authError: false,
    accessToken: '',
    refreshToken: '',
    serviceLoaded: false,
    serviceData: []
  },
  store: store,
  methods: {
    getToken: function(){
      console.log("REQUESTING TOKEN");
      axios.post(url + '/oauth/token',{
        'grant_type': 'password',
        'client_id': '1',
        'client_secret': 'NFNdVnV6oBBanDINeut4EsRwPVt8it6Cxv0xLm7Z',
        'username': this.form.username,
        'password': this.form.password,
        'scope' : ''
      }).then(response => {
        console.log("RESPONSE");
        console.log(response);
        this.authError = false;
        this.accessToken = response.data.access_token;
        this.refreshToken = response.data.refresh_token;
        this.authValid = true;
      }).catch(error => {
        console.log("ERROR");
        console.log(error);
        this.authError = true;
      })
    },
    tryService: function(){
      this.$store.commit('setLoading', true);
      console.log('TRYING SERVICE');
      axios.get(url + '/api/users', {
        headers: {
          'Authorization': 'Bearer ' + this.accessToken
        }
      })
        .then(response => {
          console.log(response.data);
          this.authError = false;
          this.authValid = true;
          this.serviceLoaded = true;
          this.serviceData = response.data;
          this.$store.commit('setLoading', false);
        })
        .catch(error => {
          console.log(error.response.status);
          console.log(error.response.data);
          this.authValid = false;
          this.accessToken = "TOKEN EXPIRED";
          this.serviceLoaded = false;
          this.serviceData  = [];
          this.authError = true;
          this.getNewToken();
        })
    },
    getNewToken: function(){
      console.log("REFRESHING TOKEN");
      axios.post(url + '/oauth/token',{
        'grant_type' : 'refresh_token',
        'refresh_token' : this.refreshToken,
        'client_id': '1',
        'client_secret': 'NFNdVnV6oBBanDINeut4EsRwPVt8it6Cxv0xLm7Z',
        'scope' : '',
      }).then( response => {
        console.log(response.data);
        this.authError = false;
        this.accessToken = response.data.access_token;
        this.refreshToken = response.data.refresh_token;
        this.authValid = true;
        this.tryService();
      }).catch( error => {

      })
    },
    getRole: function(){
      axios.get(url + '/api/user/role', {
        headers: {
          'Authorization': 'Bearer ' + this.accessToken
        }
      }).then( response => {
        console.log("RESPONSE");
        console.log(response);
        Role = response.data;
        this.$store.commit('setPermissions', response.data[0].permissions)
      }).catch( error => {
        console.log("ERROR");
        console.log(error);
      });
    }
  }
})
