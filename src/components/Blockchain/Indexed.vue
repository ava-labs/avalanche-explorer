<template>
    <div class="indexed">
        <p v-show="indexed" class="icon-container indexed">
            <fa icon="check-circle"></fa>
            <span>Indexed</span>
        </p>
        <p v-show="!indexed" class="icon-container not-indexed">
            <fa icon="exclamation" class="not-indexed-icon"></fa>
            <span v-show="notIndexedLabel" class="not-indexed"
                >Not Indexed</span
            >
        </p>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class Indexed extends Vue {
    @Prop() indexed!: boolean
    @Prop() notIndexedLabel?: boolean
}
</script>

<style scoped lang="scss">
.icon-container {
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    span {
        margin-left: 6px;
        font-size: 0.8rem;
        font-weight: 500;
    }
}

.indexed {
    color: $green;
}

.not-indexed {
    color: $gray;
    opacity: 0.6;

    .not-indexed-icon {
        margin-left: 7px;
        font-size: 12px;
    }
}
</style>
