import Vue from 'vue';
import axios from 'axios';

window.Vue = Vue;
window.axios = axios;

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
  methods: {
    getToken: function(){
      console.log("REQUESTING TOKEN");
      axios.post('http://192.168.1.60:8000/oauth/token',{
        'grant_type': 'password',
        'client_id': '4',
        'client_secret': 'z5z21sZJrbNdKQUDq4NiE8Clswe6pVJajpTFmOrS',
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
      console.log('TRYING SERVICE');
      axios.get('http://192.168.1.60:8000/api/users', {
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
      axios.post('http://192.168.1.60:8000/oauth/token',{
        'grant_type' : 'refresh_token',
        'refresh_token' : this.refreshToken,
        'client_id': '4',
        'client_secret': 'z5z21sZJrbNdKQUDq4NiE8Clswe6pVJajpTFmOrS',
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
    }
  }
})
