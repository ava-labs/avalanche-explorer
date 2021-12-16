import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { IMetaTag } from '@/router/IMetaTag'

Vue.use(VueRouter)

const suffix = ' | Avalanche Explorer'
const description =
    'Avalanche Explorer is an analytics tool that enables people to search the Avalanche blockchain for transactions, addresses, and other platform activities.'
const metaTags: IMetaTag[] = [
    {
        name: 'description',
        content: description,
    },
    {
        property: 'og:description',
        content: description,
    },
]

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            auth: false,
            title: 'View All Activities | Avalanche Explorer',
            metaTags: metaTags,
        },
    },
    {
        path: '/subnets',
        name: 'Subnets',
        component: () =>
            import(/* webpackChunkName: "subnets" */ '../views/Subnets.vue'),
        meta: {
            auth: false,
            title: 'Subnets' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/subnet/:id',
        name: 'Subnet',
        component: () =>
            import(/* webpackChunkName: "subnet" */ '../views/Subnet.vue'),
        meta: {
            auth: false,
            title: 'Subnet' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/validators',
        name: 'Validators',
        component: () =>
            import(
                /* webpackChunkName: "validators" */ '../views/Validators.vue'
            ),
        meta: {
            auth: false,
            title: 'Validators Transparency' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/tx',
        name: 'Transactions',
        component: () =>
            import(
                /* webpackChunkName: "transactions" */ '../views/Transactions.vue'
            ),
        meta: {
            auth: false,
            title: 'Transactions' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/tx/:id',
        name: 'Transaction',
        component: () =>
            import(
                /* webpackChunkName: "transaction" */ '../views/Transaction.vue'
            ),
        meta: {
            auth: false,
            title: 'Transaction' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/evmtx/:id',
        name: 'EVM Transaction',
        component: () =>
            import(
                /* webpackChunkName: "evmtransaction" */ '../views/EVMTransaction.vue'
            ),
        meta: {
            auth: false,
            title: 'Transaction' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/evmblock/:id',
        name: 'EVM Block',
        component: () =>
            import(/* webpackChunkName: "evmblock" */ '../views/EVMBlock.vue'),
        meta: {
            auth: false,
            title: 'Block' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/evmaddress/:id',
        name: 'EVM Address',
        component: () =>
            import(
                /* webpackChunkName: "evmaddress" */ '../views/EVMAddress.vue'
            ),
        meta: {
            auth: false,
            title: 'Address' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/blockchains',
        name: 'Blockchains',
        component: () =>
            import(
                /* webpackChunkName: "blockchains" */ '../views/Blockchains.vue'
            ),
        meta: {
            auth: false,
            title: 'Blockchains' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/blockchain/:id',
        name: 'Blockchain',
        component: () =>
            import(
                /* webpackChunkName: "blockchains" */ '../views/Blockchain.vue'
            ),
        meta: {
            auth: false,
            title: 'Blockchain' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/assets',
        name: 'Assets',
        component: () =>
            import(/* webpackChunkName: "assets" */ '../views/Assets.vue'),
        beforeEnter() {
            const NETWORK_ID = parseInt(
                process.env.VUE_APP_DEFAULT_NETWORKID || '1'
            )
            window.location.href =
                NETWORK_ID === 1
                    ? 'https://avascan.info/tokens'
                    : 'https://testnet.avascan.info/tokens'
        },
        meta: {
            auth: false,
            title: 'Assets' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/asset/:id',
        name: 'Asset',
        component: () =>
            import(/* webpackChunkName: "asset" */ '../views/Asset.vue'),
        meta: {
            auth: false,
            title: 'Asset' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/addresses',
        name: 'Addresses',
        component: () =>
            import(
                /* webpackChunkName: "addresses" */ '../views/Addresses.vue'
            ),
        meta: {
            auth: false,
            title: 'Addresses' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/address/:address',
        name: 'Address',
        component: () =>
            import(/* webpackChunkName: "address" */ '../views/Address.vue'),
        meta: {
            auth: false,
            title: 'Address' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/search',
        name: 'Search',
        component: () =>
            import(/* webpackChunkName: "search" */ '../views/Search.vue'),
        meta: {
            auth: false,
            title: 'Search' + suffix,
            metaTags: metaTags,
        },
    },
    {
        path: '/resources',
        name: 'Resources',
        component: () =>
            import(
                /* webpackChunkName: "resources" */ '../views/Resources.vue'
            ),
        meta: {
            auth: false,
            title: 'Resources' + suffix,
            metaTags: metaTags,
        },
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    // Scroll to top on route change
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes,
})

export default router
