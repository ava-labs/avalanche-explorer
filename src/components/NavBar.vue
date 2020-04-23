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
                <h1>AVA Block Explorer</h1>
            </router-link>
        </div>
        <v-spacer></v-spacer>
        <div class="rightside">
            <div class="row" style="display: flex">
                <div class="routes">
                    <router-link to="/">Home</router-link>
                    <router-link to="/blockchain">Blockchain</router-link>
                    <router-link to="/tokens">Tokens</router-link>
                    <router-link to="/resources">Resources</router-link>
                    <router-link to="/developers">Developers</router-link>
                </div>
                <div class="avatar"></div>
            </div>
            <div class="row">
                <search-bar class="search_bar" placeholder="Search by Address / TxId / BlockId / AssetId"></search-bar>
            </div>
        </div>
    </v-app-bar>
</template>
<script>
    import Vue from "vue";
    import SearchBar from "@/components/SearchBar";

    export default Vue.extend({
        components: {
            SearchBar,
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
                console.log(this.theme);

                // if(this.$router.currentRoute.name == "Home"){
                //     res = "transparent";
                // }
                console.log(res);
                return res;
            }
        }
    })
</script>

<style scoped lang="scss">

    .navbar{
        padding: 0px 18vw;

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

        > div{
            justify-content: flex-end;
            margin: 8px 0px;
        }
    }

    .routes{
        border-right: 1px solid #D6DAE1;
        padding: 4px 0px;
    }

    .routes a{
        color: #7A838E;
        text-decoration: none;
        font-weight: lighter;
        font-size: 14px;
        padding-right: 10px;

        &.router-link-exact-active{
            color: #000;
        }
    }

    .avatar{
        margin-left: 10px;
        background-color: #F1F2F3;
        height: auto;
        width: 24px;
    }


</style>
