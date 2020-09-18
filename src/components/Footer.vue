<template>
    <v-footer color="#000">
        <div class="powered_by">
            <div class="header">
                <img src="@/assets/ava_logo_white.png" />
                <h4>Avalanche Explorer</h4>
            </div>
            <p class="avalanche_desc">Avalanche Explorer is an analytics tool that enables people to search the Avalanche blockchain for transactions, addresses, and other platform activities.</p>
            <img class="yeti" src="@/assets/yeti_footer.png" />
        </div>
        <div class="list">
            <h4>Menu</h4>
            <router-link to="/">Home</router-link>
            <router-link to="/subnets">Subnets</router-link>
            <router-link to="/validators">Validators</router-link>
            <router-link to="/assets">Assets</router-link>
            <!-- <router-link to="/addresses">Addresses</router-link> -->
            <router-link to="/blockchains">Blockchains</router-link>
            <a href="https://cchain.explorer.avax.network/">C-Chain</a>
            <router-link to="/resources">Resources</router-link>
        </div>
        <div class="list">
            <h4>Social</h4>
            <a href="https://twitter.com/avalancheavax" target="_blank">
                <fa :icon="['fab','twitter']"></fa>Twitter
            </a>
            <a href="https://chat.avax.network" target="_blank">
                <fa :icon="['fab','discord']"></fa>Discord
            </a>
            <a href="https://reddit.com/r/avax" target="_blank">
                <fa :icon="['fab','reddit']"></fa>Reddit
            </a>
        </div>
    </v-footer>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
@use "../main";
.v-footer {
    margin: 60px 0 -1px 0;
    padding-top: 60px !important;
    padding-bottom: 0px !important;
    color: main.$white !important;
    align-items: flex-start;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 60px;

    h4 {
        margin-top: 12px;
    }
}
.powered_by {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .header {
        display: flex;
        align-items: center;
        font-size: 24px;

        h4 {
            margin: 0;
        }

        img {
            width: auto;
            margin-right: 10px;
            height: 22px;
            object-fit: contain;
        }
    }

    p {
        margin: 24px 0px;
        font-size: 13px;
        font-weight: lighter;
    }

    img.yeti {
        width: 60%;
        max-width: 240px;
    }
}

.avalanche_desc {
    line-height: 1.5em;
}

.list {
    display: flex;
    flex-direction: column;
    padding-bottom: 30px;
    font-size: 14px;

    &:last-of-type {
        margin: 0;
    }

    h4 {
        padding-bottom: 8px;
        border-bottom: 1px solid #fff7;
    }

    a {
        font-weight: lighter;
        color: main.$white !important;
        margin-bottom: 14px;
        text-decoration: none;

        svg {
            font-size: 16px;
            margin-right: 8px;
        }
    }
}

@include main.smOnly {
    .v-footer {
        grid-template-columns: none;
        grid-template-rows: max-content max-content max-content;
        padding: 20px 30px;
        padding-bottom: 0;
        flex-direction: column-reverse;
        justify-content: center;
    }

    .list {
        width: 100%;
    }

    .powered_by {
        grid-row: 3;
    }
}

@include main.xsOnly {
    .v-footer {
        grid-template-columns: none;
        grid-template-rows: max-content max-content max-content;
        padding: 20px 30px;
        padding-bottom: 0;
        flex-direction: column-reverse;
        justify-content: center;
    }

    .list {
        width: 100%;
    }

    .powered_by {
        grid-row: 3;
    }
}
</style>
