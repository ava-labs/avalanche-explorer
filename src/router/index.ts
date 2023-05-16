import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { IMetaTag } from '@/router/IMetaTag'
import {
    DEFAULT_NETWORK_ID,
    explorerFEUrl,
    explorerFEUrl_test,
    subnetExplorerUrl as subnetExplorerUrl_main,
    subnetExplorerUrl_test,
} from '@/store/modules/network/network'
import { C, P, X } from '@/known_blockchains'

Vue.use(VueRouter)

const suffix = ' | Avalanche Explorer'
const description =
    'Avalanche Explorer is an analytics tool that enables people to search the Avalanche blockchain for transactions, addresses, and other platform activities.'
const defaultMetaTags: IMetaTag[] = [
    {
        name: 'description',
        content: description,
    },
    {
        property: 'og:description',
        content: description,
    },
]

const explorerFEURL =
    DEFAULT_NETWORK_ID === 1 ? explorerFEUrl : explorerFEUrl_test

const subnetExplorerUrl =
    DEFAULT_NETWORK_ID === 1 ? subnetExplorerUrl_main : subnetExplorerUrl_test

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            auth: false,
            title: 'View All Activities' + suffix,
            metaTags: defaultMetaTags,
        },
        beforeEnter() {
            if (window.location.href !== explorerFEURL) {
                window.location.href = explorerFEURL
            }
        },
    },
    {
        path: '/subnets',
        name: 'Subnets',
        meta: {
            auth: false,
            title: 'Subnets' + suffix,
            metaTags: defaultMetaTags,
        },
        beforeEnter() {
            window.location.href = `${subnetExplorerUrl}/subnets`
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
            metaTags: defaultMetaTags,
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
            metaTags: [
                {
                    name: 'description',
                    content:
                        'Avalanche Explorer for validators is the perfect analytics tool that enables transactions, addresses, and other platform transparency.',
                },
                {
                    property: 'og:description',
                    content:
                        'Avalanche Explorer for validators is the perfect analytics tool that enables transactions, addresses, and other platform transparency.',
                },
            ],
        },
        beforeEnter() {
            window.location.href = `${subnetExplorerUrl}/validators`
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
            metaTags: [
                {
                    name: 'description',
                    content:
                        'View transactions on P-Chain, X-Chain, and C-Chain with the Avalanche Explorer. Providing our community of individuals, developers, and investors piece of mind.',
                },
                {
                    property: 'og:description',
                    content:
                        'View transactions on P-Chain, X-Chain, and C-Chain with the Avalanche Explorer. Providing our community of individuals, developers, and investors piece of mind.',
                },
            ],
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
            metaTags: [
                {
                    name: 'description',
                    content:
                        'View transactions on P-Chain, X-Chain, and C-Chain with the Avalanche Explorer. Providing our community of individuals, developers, and investors piece of mind.',
                },
                {
                    property: 'og:description',
                    content:
                        'View transactions on P-Chain, X-Chain, and C-Chain with the Avalanche Explorer. Providing our community of individuals, developers, and investors piece of mind.',
                },
            ],
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
            metaTags: defaultMetaTags,
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
            metaTags: defaultMetaTags,
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
            metaTags: defaultMetaTags,
        },
    },
    {
        path: '/blockchains',
        name: 'Blockchains',
        beforeEnter() {
            window.location.href = `${subnetExplorerUrl}/subnets`
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
            metaTags: [
                {
                    name: 'description',
                    content:
                        'Blockchain transparency with the Avalanche Explorer enables people to search for transactions, addresses, and other platform activities.',
                },
                {
                    property: 'og:description',
                    content:
                        'Blockchain transparency with the Avalanche Explorer enables people to search for transactions, addresses, and other platform activities.',
                },
            ],
        },
        beforeEnter(to: any, from: any, next: any) {
            if ([C.id, P.id, X.id].includes(to.params.id)) {
                next()
                return
            }

            window.location.href = `${subnetExplorerUrl}/subnets`
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
            metaTags: defaultMetaTags,
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
            metaTags: defaultMetaTags,
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
            metaTags: defaultMetaTags,
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
            metaTags: defaultMetaTags,
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
            metaTags: defaultMetaTags,
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
            metaTags: defaultMetaTags,
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
