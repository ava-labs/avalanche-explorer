<template>
    <div class="search">
        <div class="card">
            <template v-if="loading && query">
                <Loader :contentId="query" :message="'Searching'"></Loader>
            </template>
            <div>
                <p v-if="loading && query">Searching for {{ query }}</p>
            </div>

            <p v-if="!loading">
                Showing results for <span>{{ query }}</span>
            </p>
            <div class="results" v-if="!loading && results.length > 0">
                <result-row
                    v-for="(res, i) in results"
                    class="result_row"
                    :key="i"
                    :result="res"
                ></result-row>
            </div>
            <div class="not_found card" v-if="!loading && results.length === 0">
                <h2>Not Found</h2>
                <p>
                    Couldn't find any transaction, address or asset with that
                    query.
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Watch } from "vue-property-decorator";
import api from "@/axios";
import ResultRow from "@/components/Search/ResultRow.vue";
import AddressRow from "@/components/rows/AddressRow.vue";
import Loader from "@/components/misc/Loader.vue";

@Component({
    components: {
        Loader,
        ResultRow,
    },
})
export default class Search extends Vue {
    loading: boolean = false;
    query: string | (string | null)[] = "";
    results: any[] = [];

    created() {
        this.query = this.$router.currentRoute.query.query;
        if (this.query) {
            this.search();
        }
    }

    @Watch("$route")
    onRouteChanged(val: any) {
        this.results = [];
        this.query = val.query.query;
        this.search();
    }

    search() {
        this.loading = true;
        // TODO: support service for multiple chains
        api.get("/x/search?query=" + this.query).then((res) => {
            this.loading = false;
            let data = res.data;
            if (data === null) {
                this.results = [];
            } else {
                this.results = data.results;
            }
        });
    }
}
</script>

<style scoped lang="scss">
.results {
    margin-top: 40px;
}

.result_row {
    background-color: $white;
    padding: 25px 30px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    margin-bottom: 4px;
}

.not_found {
    width: 100%;
    align-items: center;
    padding: 30px 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

@include smOnly {
    .result_row {
        padding: 6px 12px;
    }
}
</style>
