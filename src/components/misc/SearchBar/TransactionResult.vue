<template>
    <div class="search_result" @click="select">
        <div class="symbol_container">
            <p
                class="symbol"
                :style="{
                    backgroundColor: chainDarkColor,
                }"
            >
                <span
                    :style="{
                        color: chainColor,
                    }"
                    >Tx</span
                >
            </p>
        </div>
        <div class="data">
            <p class="result_id">{{ item.id }}</p>
            <div class="result_details">
                <p class="details_ago">
                    {{ new Date(item.timestamp) | fromNow }}
                </p>
                <p
                    class="details_chain"
                    :style="{
                        color: chainColor,
                    }"
                >
                    {{ chainName }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getTxChainType } from '@/known_blockchains'

@Component({})
export default class TransactionResult extends Vue {
    @Prop() item!: any

    select() {
        this.$router.push(`/tx/${this.item.id}`)
        this.$emit('select')
    }

    get chainColor() {
        return getTxChainType(this.item.chainID)!.color
    }

    get chainDarkColor() {
        return getTxChainType(this.item.chainID)!.darkColor
    }

    get chainName() {
        return getTxChainType(this.item.chainID)!.name
    }
}
</script>

<style scoped lang="scss">
.symbol_container {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.symbol {
    padding: 0;
    border-radius: 20px;
    font-weight: 500;
    font-size: 11px;
    height: 38px;
    width: 38px;
    line-height: 38px;
    text-align: center;
}

.result_id {
    color: $primary-color;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
}

.result_details {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;

    .details_ago,
    .details_chain {
        margin-top: 4px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .details_ago {
        opacity: 0.7;
    }
}
</style>
