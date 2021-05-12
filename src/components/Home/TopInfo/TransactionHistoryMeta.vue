<template>
    <div id="tx_history_statistics">
        <section class="stats">
            <dl>
                <dd>Addresses</dd>
                <dt>
                    {{ aggregates.addressCount.toLocaleString() }}
                </dt>
            </dl>
            <dl>
                <dd>Assets</dd>
                <dt>
                    {{ aggregates.assetCount.toLocaleString() }}
                </dt>
            </dl>
        </section>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import TooltipHeading from '../../misc/TooltipHeading.vue'
import TooltipMeta from '../TopInfo/TooltipMeta.vue'

@Component({
    components: {
        TooltipHeading,
        TooltipMeta,
    },
})
export default class NetworkActivity extends Vue {
    @Prop() aggregates!: any
}
</script>
<style scoped lang="scss">
#tx_history_statistics {
    margin-top: 10px;
}

.stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 24px;
    column-gap: 24px;
    padding: 0 0 24px;
    flex-wrap: wrap;
    overflow: auto;
    width: 100%;
}

@include xsOrSmaller {
    .stats {
        grid-template-columns: 1fr 1fr;
    }
}
</style>
