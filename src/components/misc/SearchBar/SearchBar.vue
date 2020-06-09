<template>
    <div class="search_bar">
        <input
            type="text"
            v-model="searchValue"
            @keyup.enter="search"
            @input="oninput"
            @focus="onfocus"
            @blur="onblur"
            :placeholder="placeholder"
        />
        <v-btn @click="search" color="#71C5FF" :loading="isAjax" depressed>
            <fa icon="search"></fa>
        </v-btn>
        <transition name="fade">
            <div class="search_results" v-if="showResults">
                <div class="no_result" v-if="isAjax">
                    <p>Searching...</p>
                </div>
                <div v-else>
                    <div class="no_result" v-if="results.length===0">
                        <p class="icon">
                            <fa icon="snowman"></fa>
                        </p>
                        <p>No Results Found</p>
                    </div>
                    <search-result
                        class="search_result"
                        v-for="(res) in results"
                        :key="getKey(res)"
                        :item="res"
                        @click.native="onSelectResult(res)"
                    ></search-result>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import Vue from "vue";
import axios from "@/axios";
import SearchResult from "@/components/misc/SearchBar/SearchResult";

export default Vue.extend({
    components: {
        SearchResult
    },
    data() {
        return {
            showResults: false,
            results: [],
            isAjax: false,
            searchValue: ""
        };
    },
    created() {
        // assign debounce here (not in methods, which is trouble)
        this.debounceSearch = this.debounce(this.autoSearch, 500);
    },
    props: {
        placeholder: {
            type: String,
            default: ""
        }
    },
    methods: {
        onfocus() {
            // display previous results, if any
            if (this.searchValue.length > 0) {
                this.showResults = true;
            }
        },
        onblur() {
            this.showResults = false;
        },
        search() {
            if (!this.canSearch) return;
            this.$emit("search", this.searchValue);
        },
        oninput() {
            this.$emit("input", this.searchValue);
            this.debounceSearch();
        },
        autoSearch() {
            let parent = this;
            let query = this.searchValue;
            const SEARCH_LIM = 5;

            if (query === "") {
                this.showResults = false;
                return;
            }

            let split = query.split("-");
            query = split[split.length - 1];

            this.isAjax = true;
            this.showResults = true;
            axios.get(`/x/search?query=${query}&limit=${SEARCH_LIM}`)
                .then(res => {
                    let data = res.data;
                    parent.results = data.results;
                    parent.isAjax = false;
                });
        },
        debounce(func, wait, immediate) {
            let timeout;
            return function executedFunction(...theArgs) {
                let context = this;
                let args = theArgs;
                let later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                let callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },
        getKey(item) {
            let res = item.type;
            if (item.type === "address") {
                res += item.data.address;
            } else {
                res += item.data.id;
            }
            return res;
        },
        onSelectResult(item) {
            this.showResults = false;
            this.searchValue = "";
        }
    },
    computed: {
        canSearch() {
            return this.searchValue === "" ? false : true;
        }
    }
});
</script>

<style scoped lang="scss">
@use '../../../main';

.search_bar {
    display: flex;
    background-color: transparent;
    position: relative;
}

input {
    background-color: transparent;
    color: #333;
    padding: 8px 13px;
    flex-grow: 1;
    outline: none;
    border: 1px solid #d6dae1;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-right: none;
    font-size: 12px;
}

.v-btn {
    border: none;
    border-radius: 0;
    cursor: pointer;
    font-size: 12px;
    color: #fff !important;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.search_results {
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    border-radius: 2px;
    background-color: #fff;
    top: calc(100% + 4px);
    left: 0px;
    font-size: 12px;
    color: #333;
    border: 1px solid #d2d2d2;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);

    & :last-child {
        border: none !important;
    }
}

.no_result {
    padding: 10px 30px;
    display: flex;
    align-items: center;

    .icon {
        font-size: 26px;
        margin-right: 15px;
        opacity: 0.4;
    }
}

.search_result {
    border-bottom: 1px solid #d2d2d2;
    cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

@include main.sm-device {
    .search_results {
        position: fixed;
    }
}
</style>
