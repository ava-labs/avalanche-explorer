<template>
    <v-footer color="#000">
        <div class="powered_by">
            <div class="header">
                <img src="@/assets/ava_logo_white.png">
                <h4>Powered by AVA</h4>
            </div>
            <p>AVA is a Block Explorer and Analytics
                Platform for AVA Labs, a decentralized smart contracts platform.</p>
            <img class="yeti" src="@/assets/yeti_footer.png">
        </div>
        <div class="list">
            <h4>Menu</h4>
            <a>Home</a>
            <a>Blockchain</a>
            <a>Tokens</a>
            <a>Resources</a>
            <a>Developers</a>
        </div>
        <div class="list">
            <h4>Social</h4>
            <a href="https://twitter.com/avalabsofficial" target="_blank"><fa :icon="['fab','twitter']"></fa> Twitter</a>
            <a href="https://discord.gg/Ja3CSs7" target="_blank"><fa :icon="['fab','discord']"></fa> Discord</a>
            <a href="https://www.reddit.com/r/ava/" target="_blank"><fa :icon="['fab','reddit']"></fa> Reddit</a>
        </div>
    </v-footer>
</template>
<style scoped lang="scss">
    .v-footer{
        padding: 30px 18vw;
        padding-bottom: 0px;
        color: #fff !important;
        display: flex;
        align-items: start;
    }
    .powered_by{
        margin-right: 90px;
        width: 300px;


        .header{
            display: flex;
            align-items: center;
            font-size: 24px;

            h4{
                margin: 0;
            }

            img{
                width: auto;
                margin-right: 10px;
                height: 22px;
                object-fit: contain;
            }
        }
        p{
            margin: 24px 0px;
            font-size: 13px;
            font-weight: lighter;
        }

        img.yeti{
            width: 60%;
        }
    }

    .list{
        display: flex;
        flex-direction: column;
        min-width: 200px;
        margin-right: 60px;
        padding-bottom: 30px;

        font-size: 14px;

        &:last-of-type{
            margin: 0;
        }

        h4{
            padding-bottom: 8px;
            border-bottom: 1px solid #fff7;
        }

        a{
            font-weight: lighter;
            color: #fff;
            margin-bottom: 14px;
            text-decoration: none;


            svg{
                font-size: 16px;
                margin-right: 8px;
            }
        }
    }
</style>
