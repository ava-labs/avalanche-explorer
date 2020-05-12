<template>
    <div class="resources">
        <div class="main">
            <h1>AVA Directory</h1>
            <hr>
            <div class="cards">
                <div class="card">
                    <img src="@/assets/resources_view/Wallet.png">
                    <h4>Wallet & Faucet</h4>
                    <p>Used to receive and spend cryptoassets</p>
                    <div class="buts">
                        <a href="https://wallet.ava.network" target="_blank">Wallet</a>
                        <a href="https://faucet.ava.network" target="_blank">Faucet</a>
                    </div>
                </div>


                <div class="card">
                    <img src="@/assets/resources_view/Group.png">
                    <h4>Learning Resources</h4>
                    <p>Learn more about blockchain basics</p>
                    <div class="buts">
                        <a href="https://docs.ava.network/" target="_blank">Documentation</a>
                        <a href="https://github.com/ava-labs" target="_blank">Github</a>
                    </div>
                </div>


                <div class="card">
                    <img src="@/assets/resources_view/Blog.png">
                    <h4>Social</h4>
                    <p>Get close to the community</p>
                    <div class="buts">
                        <a href="https://discord.com/invite/Ja3CSs7" target="_blank">Discord</a>
                        <a href="https://twitter.com/avalabsofficial" target="_blank">Twitter</a>
                    </div>
                </div>


                <div class="card ava_x">
                    <img src="@/assets/resources_view/ice_cream.png">
                    <h4>AVA-X</h4>
                    <p>Apply for grants to build on AVA.</p>
                    <div class="buts">
                        <a href="https://www.avalabs.org/ava-x" target="_blank">Apply for Grants</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
    @use '../main';
    .main{
        padding: 15px 30px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
    }

    .cards{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 30px;
        padding-top: 30px;
        padding-bottom: 30px;
        margin-bottom: 10vh;
    }

    h1{
        margin: 30px auto;
        font-size: 14px;
    }

    hr{
        opacity: 0.2;
    }

    .card{
        background-color: #F1F2F3;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 14px 30px;
        border-radius: 6px;
        box-shadow: 0px 1px #B5BAC088;


        h4{
            font-weight: lighter;
            font-size: 22px;
            margin: 8px 0px;
            text-align: center;
        }

        p{
            text-align: center;
            color: #7A838E;
            font-size: 13px;
        }
        img{
            max-height: 40px;
            object-fit: contain;
        }

        .buts{
            margin-top: 12px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 20px;
        }

        button, a{
            padding: 6px 0;
            border-radius: 4px;
            background-color: #fff;
            border: none;
            outline: none;
            color: #7A838E !important;
            text-align: center;
            text-decoration: none;
            font-size: 12px;
            box-shadow: 0px 1px #B5BAC088;
        }
    }
    .ava_x .buts{
        grid-template-columns: 1fr;
    }

    .found_more{
        margin: 30px;
        text-align: center;
        color: #929BA6;
        font-size: 12px;
    }

    @media only screen and (max-width: main.$mobile_width) {
        .cards{
            display: flex;
            flex-direction: column;
        }

        .card{
            margin-bottom: 30px;
        }
    }
</style>
