<template>
    <div class="resources">
        <div class="main">
            <h1>AVA Directory</h1>
            <hr>
            <div class="cards">
                <div class="card">
                    <img src="@/assets/resources_view/Wallet.png">
                    <h4>Wallet</h4>
                    <p>Used to receive and spend cryptoassets</p>
                    <div class="buts">
                        <button>Top Accounts</button>
                        <button>Verified Contracts</button>
                    </div>
                </div>


                <div class="card">
                    <img src="@/assets/resources_view/Group.png">
                    <h4>Learning Resources</h4>
                    <p>Learn more about blockchain basics</p>
                    <div class="buts">
                        <button>Top Accounts</button>
                        <button>Verified Contracts</button>
                    </div>
                </div>


                <div class="card">
                    <img src="@/assets/resources_view/Blog.png">
                    <h4>Blog</h4>
                    <p>Get close to the community</p>
                    <div class="buts">
                        <button>Top Accounts</button>
                        <button>Verified Contracts</button>
                    </div>
                </div>


                <div class="card">
                    <img src="@/assets/resources_view/ice_cream.png">
                    <h4>Other</h4>
                    <p>Extra resources</p>
                    <div class="buts">
                        <button>Top Accounts</button>
                        <button>Verified Contracts</button>
                    </div>
                </div>
            </div>

            <p class="found_more">Found something interesting or a must read? <a>Submit it here</a></p>
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

        button{
            padding: 6px 0;
            border-radius: 4px;
            background-color: #fff;
            border: none;
            outline: none;
            color: #7A838E;
            box-shadow: 0px 1px #B5BAC088;
        }
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
