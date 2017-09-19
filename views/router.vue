<script>
import VueRouter from 'vue-router';
import Home from 'Home.vue';
import User from 'User.vue';

Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/user',
    component: User
  },
  {
    path: '/login',
    component: Login
  }
]

export default new VueRouter(

)
</script>
