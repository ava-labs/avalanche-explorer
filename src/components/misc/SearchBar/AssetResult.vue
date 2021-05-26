<template>
    <div class="search_result" @click="select">
        <div class="symbol_container">
            <p class="symbol">{{ symbol }}</p>
        </div>
        <div class="data">
            <p class="name">
                {{ name }} <span>{{ idAbbreviated }}</span>
            </p>
            <p class="supply">
                Supply {{ supply.toLocaleString() }} {{ symbol }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { stringToBig } from '@/helper'

@Component({})
export default class AssetResult extends Vue {
    @Prop() item!: any

    get id() {
        return `${this.item.id}`
    }

    get idAbbreviated() {
        return `${this.item.id.substring(0, 8)}...`
    }

    get name() {
        return this.item.name
    }

    get symbol() {
        return this.item.symbol
    }

    get supply() {
        return stringToBig(this.item.currentSupply, this.item.denomination)
    }

    select() {
        const url = `/asset/${this.id}`
        this.$router.push(url)
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
    background-color: $secondary-color-xlight !important;
    color: $secondary-color;
    border-radius: 6px;
    font-weight: 500;
    font-size: 11px;
    height: 40px;
    width: 40px;
    line-height: 40px;
    text-align: center;
}

.name {
    color: $primary-color;
    font-weight: 700;

    span {
        display: inline-block;
        font-size: 0.875em;
        opacity: 0.7;
        padding-left: 5px;
        font-weight: 400;
    }
}

.id,
.supply {
    margin-top: 4px;
    opacity: 0.7;
}
</style>
