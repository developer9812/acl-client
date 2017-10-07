import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
    permissions: [],
    loading: false
  },
  getters: {
    permissions: state => state.permissions,
    loading: state => state.loading
  },
  mutations: {
    setPermissions: (state, payload) => {
      state.permissions = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    }
  }
});

export default store;
