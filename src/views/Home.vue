<template>
    <div class="home">
         <v-alert
            prominent
            type="warning"
            id="network-error"
            >
            <v-row align="center">
                <v-col class="grow">Sorry the Explorer is experiencing issues.<br><br>The Denali Network remains operational. You can still <a id="link" href="https://docs.ava.network/v1.0/en/api/avm/#avmgettxstatus">check your transaction activity</a> while we work on resolving these issues.</v-col>
            </v-row>
            </v-alert>
        <top-info class="card"></top-info>
        <recent-transactions class="card recent_tx"></recent-transactions>
    </div>
</template>

<script>
import TopInfo from "@/components/Home/TopInfo/TopInfo";
import RecentTransactions from "@/components/Home/RecentTransactions";

export default {
    name: "Home",
    components: {
        TopInfo,
        RecentTransactions
    }
};
</script>

<style scoped lang="scss">
@use "../main";

#network-error {
    font-weight: bold;
}
#link {
    color: main.$white !important;
    text-decoration: underline;
    font-weight: bold;
}

.home {
    margin: 0px auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.recent_tx {
    width: 100%;
    margin-top: 15px;
    box-sizing: border-box;
}

.tables {
    display: grid;
    grid-template-columns: 1fr 280px;
    grid-gap: 30px;
}
</style>
