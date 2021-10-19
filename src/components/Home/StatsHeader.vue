<template>
    <div class="header">
        <div class="left">
            <h2>Stats</h2>
            <p class="chain">
                View up-to-date statistics for the Avalanche network on
                <a class="c_chain_link" :href="statsURL">stats.avax.network</a>.
            </p>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'

@Component({
    components: {},
})
export default class StatsHeader extends Vue {
    get statsURL() {
        return 'https://stats.avax.network/'
    }
}
</script>
<style scoped lang="scss">
.margin-left {
    margin-left: 10px;
}

.refresh {
    margin-left: 16px;
}

.ava-btn-label {
    padding-left: 8px;
}

.c_chain_link {
    text-decoration: underline;
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    h2 {
        padding-bottom: 10px;
    }

    .refresh {
        color: $primary-color;
        text-transform: none;
        border: none;
    }

    .left {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex-grow: 1;
    }

    .right {
        flex-grow: 1;
        display: flex;
        flex-direction: row-reverse;
        align-items: flex-end;
    }
}
@include smOnly {
    .header {
        padding-bottom: 0;

        .right {
            display: none;
        }
    }
}

@include xsOrSmaller {
    .header {
        display: flex;
        flex-direction: column;

        .left {
            display: flex;
            width: 100%;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .right {
            padding: 15px 0;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-content: center;
        }
    }
}
</style>
