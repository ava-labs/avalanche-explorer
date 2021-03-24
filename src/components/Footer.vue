<template>
    <v-footer color="#FFF">
        <div class="powered_by">
            <div class="header">
                <img src="@/assets/ava_logo_black.png" />
                <h4>Avalanche Explorer</h4>
            </div>
            <p class="avalanche_desc">
                Avalanche Explorer is an analytics tool that enables people to
                search the Avalanche blockchain for transactions, addresses, and
                other platform activities.
            </p>
            <p class="avalanche_desc tos">
                By using this application you agree to the
                <a
                    href="/Avalanche (BVI) Inc. Explorer Terms of Use.pdf"
                    target="_blank"
                    >Terms of Use</a
                >.
            </p>
        </div>
        <div class="lists">
            <div class="list">
                <h4>Menu</h4>
                <router-link to="/">Home</router-link>
                <router-link to="/subnets">Subnets</router-link>
                <router-link to="/validators">Validators</router-link>
                <router-link to="/assets">Assets</router-link>
                <router-link to="/blockchains">Blockchains</router-link>
                <a href="https://cchain.explorer.avax.network/">C-Chain</a>
                <router-link to="/resources">Resources</router-link>
            </div>
            <div class="list">
                <h4>Social</h4>
                <a href="https://twitter.com/avalancheavax" target="_blank">
                    <fa :icon="['fab', 'twitter']"></fa>Twitter
                </a>
                <a href="https://chat.avax.network" target="_blank">
                    <fa :icon="['fab', 'discord']"></fa>Discord
                </a>
                <a href="https://reddit.com/r/avax" target="_blank">
                    <fa :icon="['fab', 'reddit']"></fa>Reddit
                </a>
            </div>
        </div>
    </v-footer>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.v-footer {
    margin: 60px 0 -1px 0;
    padding-top: 40px !important;
    padding-bottom: 0px !important;
    color: $black !important;
    font-weight: 500;
    align-items: flex-start;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    h4 {
        margin-top: 12px;
    }
}

.powered_by {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 415px;

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
        font-size: 14px;
    }

    .tos {
        margin-top: 0;
        margin-bottom: 48px;

        a {
            color: $black !important;
            text-decoration: underline;
        }
    }
}

.avalanche_desc {
    line-height: 1.5em;
}

.lists {
    display: flex;
    flex-direction: row;
}

.list {
    display: flex;
    flex-direction: column;
    padding-bottom: 30px;
    font-size: 14px;
    width: 150px;

    &:first-of-type {
        margin-right: 70px;
    }

    &:last-of-type {
        margin: 0;
    }

    h4 {
        padding-top: 0;
        padding-bottom: 8px;
        border-bottom: 2px solid $black;
        margin-bottom: 30px;
    }

    a {
        color: $black !important;
        margin-bottom: 21px;
        text-decoration: none;

        svg {
            font-size: 16px;
            margin-right: 8px;
        }
    }
}

@include smOnly {
    .v-footer {
        flex-direction: column;
        justify-content: flex-start;
    }

    .lists {
        width: 100%;
    }

    .list {
        width: unset;
        flex-basis: 1;
    }

    .list:first-of-type {
        margin-right: 30px;
    }
}

@include xsOnly {
    .v-footer {
        flex-direction: column;
        justify-content: flex-start;
    }

    .lists {
        width: 100%;
    }

    .list {
        width: unset;
        flex-grow: 1;
    }

    .list:first-of-type {
        margin-right: 30px;
    }
}
</style>
