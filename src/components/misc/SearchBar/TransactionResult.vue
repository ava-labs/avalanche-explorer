<template>
    <div class="search_result" @click="select">
        <div class="symbol_container">
            <p class="symbol">Tx</p>
        </div>
        <div class="data">
            <p class="id">{{ item.id }}</p>
            <p class="ago">{{ new Date(item.timestamp) | fromNow }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class TransactionResult extends Vue {
    @Prop() item!: any

    select() {
        this.$router.push(`/tx/${this.item.id}`)
        this.$emit('select')
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
    background-color: $white;
    border-radius: 20px;
    border: 2px solid $black;
    font-weight: 500; /* 700 */
    font-size: 11px;
    height: 38px;
    width: 38px;
    line-height: 38px;
    text-align: center;
}

.id {
    color: $primary-color;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 700;
}

.ago {
    margin-top: 4px;
    opacity: 0.7;
}
</style>
