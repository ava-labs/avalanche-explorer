<template>
    <div class="pagination_control">
        <button :class="{ disabled: cursor === 'first' }" @click="first()">
            First
        </button>
        <button
            :class="{ disabled: cursor === 'first' || adjCursor === 'first' }"
            @click="next()"
        >
            <fa icon="angle-left"></fa>
        </button>
        <p class="pages"></p>
        <button :class="{ disabled: cursor === 'last' }" @click="prev()">
            <fa icon="angle-right"></fa>
        </button>
        <button :class="{ disabled: cursor === 'last' }" @click="last()">
            Last
        </button>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class TxPaginationControls extends Vue {
    cursor = 'first'
    adjCursor = 'first'

    first() {
        this.cursor = 'first'
        this.$emit('first')
    }

    prev() {
        this.cursor = 'prev'
        if (this.adjCursor !== 'first') {
            this.adjCursor = ''
        }
        this.$emit('prev')
    }

    next() {
        this.cursor = 'next'
        this.$emit('next')
    }

    last() {
        this.cursor = 'last'
        this.adjCursor = 'last'
        this.$emit('last')
    }
}
</script>

<style scoped lang="scss">
.pagination_control {
    display: flex;
    font-size: 12px;

    > * {
        background-color: transparent;
        color: $primary-color;
        border: none;
        margin: 0px 2px;
        padding: 6px 12px;
        border-radius: 4px;
        transition: opacity 0.3s;
        cursor: pointer;

        &:hover {
            opacity: 0.7;
            text-decoration: underline;
        }
    }
}

button {
    outline: none;
    font-size: 12px;
}

.pages {
    color: $black;
    cursor: default;
    width: 100px;

    &:hover {
        opacity: 1;
        text-decoration: none;
    }

    span {
        font-weight: 500;
    }
}

.disabled {
    color: $gray;
    cursor: default;

    &:hover {
        opacity: 1;
        text-decoration: none;
    }
}
</style>
