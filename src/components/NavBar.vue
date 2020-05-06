<template>
    <v-app-bar
            class="navbar"
            app
            dark
            :height="100"
            flat
            dense
            hide-on-scroll
            :style="{
                backgroundColor: navColor
            }"
    >
        <div class="logo">
            <router-link to="/">
                <img src="@/assets/yeti_logo.png">
                <h1>AVA Explorer</h1>
            </router-link>
        </div>
        <v-spacer class="spacer_mid"></v-spacer>
        <div class="rightside">
            <div class="row" style="display: flex">
                <div class="routes">
                    <router-link to="/">Home</router-link>
                    <router-link to="/blockchain">Blockchain</router-link>
                    <router-link to="/tokens">Tokens</router-link>
                    <router-link to="/resources">Resources</router-link>
<!--                    <router-link to="/developers">Developers</router-link>-->
                </div>
<!--                <div class="avatar"></div>-->
            </div>
            <div class="row">
                <search-bar class="search_bar" placeholder="Search by Address / TxId / Asset" @search="onsearch"></search-bar>
            </div>
        </div>
    </v-app-bar>
</template>
<script>
    import Vue from "vue";
    import SearchBar from "@/components/misc/SearchBar/SearchBar";

    export default Vue.extend({
        components: {
            SearchBar,
        },
        methods: {
            onsearch(val){
                this.$router.push({ path: '/search', query: { query: val } })
            }
        },
        computed:{
            themeType(){
                return (this.$vuetify.theme.dark) ? 'dark' : 'light'
            },
            theme(){
                return this.$vuetify.theme.themes[this.themeType]
            },
            showSearch(){
                if(this.$router.currentRoute.name == "Home"){
                    return false;
                }
                return true;
            },
            navColor(){
                let res = '#fff';
                // console.log(this.theme);

                // if(this.$router.currentRoute.name == "Home"){
                //     res = "transparent";
                // }
                // console.log(res);
                return res;
            }
        }
    })
</script>

<style>
    .v-toolbar__content{
        padding: 0 !important;
    }
</style>

<style scoped lang="scss">
    @use'../main';

    .navbar{
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        > .v-toolbar__content{
            padding: 0;
        }
    }
    .logo{
        height: 100%;
        padding: 15px 0px;
        white-space: nowrap;
        box-sizing: border-box;

        a{
            display: flex;
            align-items: center;
            flex-direction: row;
            height: 100%;
            color: #000;
            text-decoration: none;
        }

        h1{
            font-size: 24px;
            padding-left: 10px;
        }
        img{
            max-height: calc(100% - 15px);
        }
    }
    .search_bar{
        width: 25vw;
    }



    .rightside{
        justify-content: end;
        /*overflow: auto;*/

        > div{
            justify-content: flex-end;
            margin: 8px 0px;
            white-space: nowrap;
            flex-wrap: nowrap;
        }
    }

    .routes{
        overflow: auto;
        border-right: 1px solid #D6DAE1;
        padding: 4px 0px;
        white-space: normal;
    }

    .routes a{
        color: #7A838E !important;
        text-decoration: none;
        font-weight: lighter;
        font-size: 14px;
        padding-right: 10px;

        &.router-link-exact-active{
            color: #000 !important;
        }
    }

    .avatar{
        margin-left: 10px;
        background-color: #F1F2F3;
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        flex-basis: 24px;
    }

    @media only screen and (max-width: main.$mobile_width) {
        h1{
            display: none;
        }

        .logo{
            display: none;
            height: 40px;
            padding: 0;
        }
        .rightside{
            width: 100%;
            overflow: auto;
        }
        .spacer_mid{
            display: none;
        }
        .search_bar{
            width: 100%;
        }
    }
</style>
