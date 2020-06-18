<template>
    <div class="pagination_control">
        <button @click="page=1" :class="{
            'disabled': page==1
        }">First</button>
        <button @click="pageDown" :class="{
            'disabled': page==1
        }">&#60;</button>
        <p class="pages">
            Page
            <b>{{page}}</b> of
            <b>{{totalPages}}</b>
        </p>
        <button @click="pageUp" :class="{
            'disabled': page==totalPages
        }">&#62;</button>
        <button
            @click="page=totalPages"
            :class="{
            'disabled': page==totalPages
        }"
        >Last</button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            page: 1
        };
    },
    watch: {
        page(val) {
            console.log("Page: ", val);
            let offset = (val - 1) * this.limit;
            this.$emit("change", offset);
        }
    },
    props: {
        total: {
            type: Number,
            default: 0
        },
        limit: {
            type: Number
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.total / this.limit);
        }
    },
    methods: {
        pageUp() {
            let page = this.page + 1;

            if (page > this.totalPages) return;
            this.page = page;
        },
        pageDown() {
            let page = this.page - 1;

            if (page < 1) return;
            this.page = page;
        }
    }
};
</script>
<style scoped lang="scss">
@use"../../main";

.pagination_control {
    display: flex;

    > * {
        background-color: transparent;
        color: main.$primary-color;
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
}

.pages {
    color: main.$black;
    cursor: default;

    &:hover {
        opacity: 1;
        text-decoration: none;
    }
}

.disabled {
    color: main.$gray;
    cursor: default;
    
    &:hover {
        opacity: 1;
        text-decoration: none;
    }
}
</style>
