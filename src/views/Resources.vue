<template>
    <div class="resources">
        <div class="card">
            <div class="header">
                <h2>Avalanche Directory</h2>
            </div>
            <hr />
            <div class="resource_container">
                <div class="resource">
                    <img src="@/assets/resources_view/Wallet.png" />
                    <h3>Wallet &amp; Faucet</h3>
                    <p>Used to receive and spend cryptoassets</p>
                    <div class="buts">
                        <a href="https://wallet.avax.network" target="_blank">Wallet</a>
                        <a href="https://faucet.avax.network" target="_blank">Faucet</a>
                    </div>
                </div>
                <div class="resource">
                    <img src="@/assets/resources_view/Group.png" />
                    <h3>Learning Resources</h3>
                    <p>Learn more about blockchain basics</p>
                    <div class="buts">
                        <a href="https://docs.avax.network/" target="_blank">Documentation</a>
                        <a href="https://github.com/ava-labs" target="_blank">Github</a>
                    </div>
                </div>
                <div class="resource">
                    <img src="@/assets/resources_view/Blog.png" />
                    <h3>Social</h3>
                    <p>Get close to the Avalanche community</p>
                    <div class="buts">
                        <a href="https://chat.avax.network" target="_blank">Discord</a>
                        <a href="https://twitter.com/avalancheavax" target="_blank">Twitter</a>
                    </div>
                </div>
                <div class="resource ava_x">
                    <img src="@/assets/resources_view/ice_cream.png" />
                    <h3>Avalanche-X</h3>
                    <p>Apply for grants to build on Avalanche.</p>
                    <div class="buts">
                        <a href="https://www.avalabs.org/avalanche-x" target="_blank">Apply for Grants</a>
                    </div>
                </div>
            </div>
        </div>  
    </div>
</template>
<style scoped lang="scss">
@use "../main";

hr {
    margin-top: 20px;
    opacity: 0.2;
}

.resource_container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 30px;
    padding-top: 30px;
    padding-bottom: 30px;
    margin-bottom: 10vh;
}

.resource {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 45px 30px 30px;
    border: 3px solid #e8e7ea; 
    border-radius: 7px;

    h3 {
        font-weight: 600;
        font-size: 22px;
        margin: 14px 0px 8px;
        text-align: center;
    }

    p {
        text-align: center;
        color: #7a838e;
        font-size: 13px;
        padding-bottom: 12px;

    }
    
    img {
        max-height: 40px;
        object-fit: contain;
    }

    .buts {
        margin-top: 12px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;

        a {
            border: 2px solid #17171d;
            color: #17171d !important;
            font-weight: 400; /* 700 */
            padding: 14px;
        }
    }

    button,
    a {
        padding: 6px 0;
        border-radius: 4px;
        background-color: main.$white;
        border: none;
        outline: none;
        color: #7a838e !important;
        text-align: center;
        text-decoration: none;
        font-size: 12px;
    }
}

.ava_x .buts {
    grid-template-columns: 1fr;
}

.found_more {
    margin: 30px;
    text-align: center;
    color: #929ba6;
    font-size: 12px;
}

@include main.smOnly {

    h3 {
        font-size: 18px;
    }

    .description {
        font-size: 14px;
    }

    .resource_container {
        display: flex;
        flex-direction: column;
    }

    .resource {
        margin-bottom: 30px;
    }
}
</style>
