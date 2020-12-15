<template>
    <div class="pagination_control">
        <button
            :class="{
                disabled: page == 1,
            }"
            @click="page = 1"
        >
            First
        </button>
        <button
            :class="{
                disabled: page == 1,
            }"
            @click="pageDown"
        >
            &#60;
        </button>
        <p class="pages">
            Page
            <span>{{ page }}</span> of
            <span>{{ totalPages }}</span>
        </p>
        <button
            :class="{
                disabled: page == totalPages,
            }"
            @click="pageUp"
        >
            &#62;
        </button>
        <button
            :class="{
                disabled: page == totalPages,
            }"
            @click="page = totalPages"
        >
            Last
        </button>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({})
export default class PaginationControls extends Vue {
    @Prop() total!: number
    @Prop() limit!: number

    page = 1

    @Watch('page')
    onPageChanged(val: number) {
        const offset = (val - 1) * this.limit
        this.$emit('change', offset)
    }

    get totalPages(): number {
        return Math.ceil(this.total / this.limit)
    }

    pageUp(): void {
        const page = this.page + 1
        if (page > this.totalPages) return
        this.page = page
    }

    pageDown(): void {
        const page = this.page - 1
        if (page < 1) return
        this.page = page
    }

    setPage(page: number): void {
        this.page = page
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
