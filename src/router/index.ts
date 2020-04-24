import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tokens',
    name: 'Tokens',
    component: () => import(/* webpackChunkName: "tokens" */ '../views/Tokens.vue')
  },
  {
    path: '/blockchain',
    name: 'Blockchain',
    component: () => import(/* webpackChunkName: "blockchain" */ '../views/Blockchain.vue')
  },
    {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue')
  },
  {
    path: '/tx',
    name: 'Transactions',
    component: () => import(/* webpackChunkName: "transactions" */ '../views/AllTransactions.vue')
  },
  {
    path: '/tx/:id',
    name: 'Transaction',
    component: () => import(/* webpackChunkName: "transaction" */ '../views/Transaction.vue')
  },
  {
    path: '/address/:address',
    name: 'Address',
    component: () => import(/* webpackChunkName: "address" */ '../views/Address.vue')
  }

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes
});

export default router
