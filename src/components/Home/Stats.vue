<template>
    <div class="card asset_header">
        <header class="header">
            <h2>Stats</h2>
        </header>
        <section></section>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'

@Component({
    components: {},
})
export default class AssetSummary extends Vue {}
</script>

<style scoped lang="scss">
.asset_header {
    margin-bottom: 15px;
    width: 100%;

    .header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .symbol {
        flex-shrink: 0;
        color: $secondary-color;
        background-color: $secondary-color-xlight;
        min-height: 1em;
        min-width: 20px;
        text-align: center;
        margin: 0px 10px 5px;
        padding: 3px 4px;
        font-size: 9px;
        border-radius: 3px;
        display: inline-block;
        vertical-align: middle;
    }
}

@include xsOrSmaller {
    .asset_header {
        margin-bottom: 10px;

        .header {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
