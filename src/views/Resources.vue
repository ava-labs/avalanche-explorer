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
                        <a href="https://wallet.avax.network" target="_blank"
                            >Wallet</a
                        >
                        <a href="https://faucet.avax.network" target="_blank"
                            >Faucet</a
                        >
                    </div>
                </div>
                <div class="resource">
                    <img src="@/assets/resources_view/Group.png" />
                    <h3>Learning Resources</h3>
                    <p>Learn more about blockchain basics</p>
                    <div class="buts">
                        <a href="https://docs.avax.network/" target="_blank"
                            >Documentation</a
                        >
                        <a href="https://github.com/ava-labs" target="_blank"
                            >Github</a
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
hr {
    margin-top: 20px;
    opacity: 0.2;
}

.resource_container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 60px;
    padding-top: 60px;
    padding-bottom: 0px;
    margin-bottom: 60px;
}

.resource {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 45px 30px 30px;
    border: 3px solid #e8e7ea;
    border-radius: 7px;

    h3 {
        font-weight: 300;
        font-size: 48px;
        margin: 14px 0px 15px;
        text-align: center;
        color: $primary-color;
    }

    p {
        text-align: center;
        color: $gray;
        font-size: 16px;
        padding-bottom: 15px;
    }

    img {
        max-height: 60px;
        object-fit: contain;
    }

    .buts {
        margin-top: 12px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 30px;

        a {
            font-family: 'Inter', sans-serif;
            font-weight: 700 !important;
            letter-spacing: 0.5px;
            text-transform: uppercase !important;
            font-size: 14px !important;
            padding: 10px 24px;
            color: $white !important;
            background-color: $primary-color;
            border-radius: 4px;
            text-align: center;
            text-decoration: none;
        }
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

@include smOnly {
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
