<template>
    <div class="search">
        <p>Showing results for <span>{{query}}</span></p>
        <div class="results" v-if="results.length > 0">
            <result-row
                v-for="(res, i) in results"
                class="result_row"
                :key="i"
                :result="res"
                :query="query"
            ></result-row>
        </div>
        <div class="not_found" v-else>
            <h2>Not Found</h2>
            <p>Couldn't find any transaction, address or asset with that query.</p>
        </div>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Watch } from "vue-property-decorator";
import api from "@/axios";
import ResultRow from "@/components/Search/ResultRow.vue";
import AddressRow from "@/components/rows/AddressRow.vue";

@Component({
    components: {
        ResultRow
    }
})
export default class Search extends Vue {
    query: string | (string | null)[] = "";
    results: any[] = [];

    created() {
        let query = this.$router.currentRoute.query;
        this.query = query.query;
        if (this.query) {
            this.search();
        }
    }
    
    @Watch("$route")
    onRouteChanged(val: any) {
        let query = val.currentRoute.query;
        this.query = query;
        this.search();
    }
    
    search() {
        let parent = this;
        // TODO: support service for multiple chains
        api.get("/x/search?query=" + this.query).then(res => {
            let data = res.data;
            if (data === null) {
                parent.results = [];
            } else {
                parent.results = data.results;
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
