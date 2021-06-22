<template>
    <div class="header">
        <h2>Transactions</h2>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class TxHeader extends Vue {}
</script>
<style scoped lang="scss">
.header {
    padding-bottom: 20px;
    margin-bottom: 10px;
}
</style>
