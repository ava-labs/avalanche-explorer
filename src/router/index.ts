import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { IMetaTag } from "@/router/IMetaTag";

Vue.use(VueRouter);

const prefix = "Avalanche ";
const description = "Avalanche Explorer is an analytics tool that enables people to search the Avalanche blockchain for transactions, addresses, and other platform activities."
const metaTags: IMetaTag[] = [
  {
    name: "description",
    content: description
  },
  {
    property: "og:description",
    content: description
  }
];

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      auth: false,
      title: "Avalanche Explorer: View All Activity on Avalanche",
      metaTags: metaTags
    }
  },
  {
    path: "/subnets",
    name: "Subnets",
    component: () => import(/* webpackChunkName: "subnets" */ "../views/Subnets.vue"),
    meta: {
      auth: false,
      title: prefix + "Subnets",
      metaTags: metaTags
    }
  },
  {
    path: "/subnet/:id",
    name: "Subnet",
    component: () => import(/* webpackChunkName: "subnet" */ "../views/Subnet.vue"),
    meta: {
      auth: false,
      title: prefix + "Subnet",
      metaTags: metaTags
    }
  },
  {
    path: "/validators",
    name: "Validators",
    component: () => import(/* webpackChunkName: "validators" */ "../views/Validators.vue"),
    meta: {
      auth: false,
      title: prefix + "Validators",
      metaTags: metaTags
    }
  }, 
  {
    path: "/tx",
    name: "Transactions",
    component: () => import(/* webpackChunkName: "transactions" */ "../views/Transactions.vue"),
    meta: {
      auth: false,
      title: prefix + "Transactions",
      metaTags: metaTags
    }
  },
  {
    path: "/tx/:id",
    name: "Transaction",
    component: () => import(/* webpackChunkName: "transaction" */ "../views/Transaction.vue"),
    meta: {
      auth: false,
      title: prefix + "Transaction",
      metaTags: metaTags
    }
  },
  {
    path: "/blockchains",
    name: "Blockchains",
    component: () => import(/* webpackChunkName: "blockchains" */ "../views/Blockchains.vue"),
    meta: {
      auth: false,
      title: prefix + "Blockchains",
      metaTags: metaTags
    }
  },
  {
    path: "/blockchain/:id",
    name: "Blockchain",
    component: () => import(/* webpackChunkName: "blockchains" */ "../views/Blockchain.vue"),
    meta: {
      auth: false,
      title: prefix + "Blockchain",
      metaTags: metaTags
    }
  },
  {
    path: "/assets",
    name: "Assets",
    component: () => import(/* webpackChunkName: "assets" */ "../views/Assets.vue"),
    meta: {
      auth: false,
      title: prefix + "Assets",
      metaTags: metaTags
    }
  },
  {
    path: "/asset/:id",
    name: "Asset",
    component: () => import(/* webpackChunkName: "asset" */ "../views/Asset.vue"),
    meta: {
      auth: false,
      title: prefix + "Asset",
      metaTags: metaTags
    }
  },
  {
    path: "/addresses",
    name: "Addresses",
    component: () => import(/* webpackChunkName: "addresses" */ "../views/Addresses.vue"),
    meta: {
      auth: false,
      title: prefix + "Addresses",
      metaTags: metaTags
    }
  },
  {
    path: "/address/:address",
    name: "Address",
    component: () => import(/* webpackChunkName: "address" */ "../views/Address.vue"),
    meta: {
      auth: false,
      title: prefix + "Address",
      metaTags: metaTags
    }
  },
  {
    path: "/search",
    name: "Search",
    component: () => import(/* webpackChunkName: "search" */ "../views/Search.vue"),
    meta: {
      auth: false,
      title: prefix + "Search",
      metaTags: metaTags 
    }
  },
  {
    path: "/resources",
    name: "Resources",
    component: () => import(/* webpackChunkName: "resources" */ "../views/Resources.vue"),
    meta: {
      auth: false,
      title: prefix + "Resources",
      metaTags: metaTags
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  // Scroll to top on route change
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes
});

export default router
