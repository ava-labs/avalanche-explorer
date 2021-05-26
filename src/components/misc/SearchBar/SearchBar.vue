<template>
    <div class="search_bar">
        <div class="search_input_wrapper">
            <v-btn color="#fff" :loading="isAjax" depressed @click="search">
                <fa icon="search"></fa>
            </v-btn>
            <input
                v-model="searchValue"
                type="text"
                :placeholder="placeholder"
                @keyup.enter="search"
                @keyup.esc="closeSearch"
                @input="oninput"
                @focus="onfocus"
                @blur="onblur"
            />
        </div>
        <transition name="fade">
            <div v-if="showResults" class="search_results">
                <div v-if="isAjax" class="no_result">
                    <p>Searching...</p>
                </div>
                <div v-else>
                    <!-- NO RESULTS -->
                    <div v-if="results === null" class="no_result">
                        <p class="icon">
                            <fa icon="snowman"></fa>
                        </p>
                        <p>No Results Found</p>
                    </div>
                    <!-- RESULTS -->
                    <search-result
                        v-for="res in results"
                        :key="getKey(res)"
                        class="search_result"
                        :item="res"
                        @click.native="onSelectResult(res)"
                    ></search-result>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import Vue from 'vue'
import axios from '@/axios'
import SearchResult from '@/components/misc/SearchBar/SearchResult'

export default Vue.extend({
    components: {
        SearchResult,
    },
    props: {
        placeholder: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            showResults: false,
            results: [],
            isAjax: false,
            searchValue: '',
        }
    },
    computed: {
        canSearch() {
            return this.searchValue === '' ? false : true
        },
    },
    created() {
        // assign debounce here (not in methods)
        this.debounceSearch = this.debounce(this.autoSearch, 500)
    },
    methods: {
        onfocus() {
            // display previous results, if any
            if (this.searchValue.length > 0) {
                this.showResults = true
            }
        },
        onblur() {
            this.showResults = false
            this.results = []
        },
        // Hitting [enter] takes you to the search page
        search() {
            if (!this.canSearch) return
            this.$emit('search', this.searchValue)
            this.closeSearch()
        },
        oninput() {
            this.$emit('input', this.searchValue)
            this.debounceSearch()
        },
        autoSearch() {
            let query = this.searchValue
            const SEARCH_LIM = 10

            if (query === '') {
                this.showResults = false
                return
            }

            const split = query.split('-')
            query = split[split.length - 1]

            this.isAjax = true
            this.showResults = true
            // TODO: support service for multiple chains
            axios
                .get(`/x/search?query=${query}&limit=${SEARCH_LIM}`)
                .then((res) => {
                    const data = res.data
                    this.results = data.results
                    this.isAjax = false
                })
        },
        debounce(func, wait, immediate) {
            let timeout
            return function executedFunction(...theArgs) {
                const context = this
                const args = theArgs
                const later = function () {
                    timeout = null
                    if (!immediate) func.apply(context, args)
                }
                const callNow = immediate && !timeout
                clearTimeout(timeout)
                timeout = setTimeout(later, wait)
                if (callNow) func.apply(context, args)
            }
        },
        getKey(item) {
            let res = item.type
            if (item.type === 'address') {
                res += item.data.address
            } else {
                res += item.data.id
            }
            return res
        },
        onSelectResult() {
            this.showResults = false
            this.searchValue = ''
        },
        closeSearch() {
            this.showResults = false
            this.searchValue = ''
            this.results = []
        },
    },
})
</script>

<style scoped lang="scss">
.search_input_wrapper {
    width: 100%;
    padding: 5px;
    background-color: $bg-light;
    display: flex;

    border: 1px solid $primary-color;
    box-sizing: border-box;
    border-radius: 50px;
}

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
    border: 2px solid transparent;
    font-size: 12px;
}

.v-btn {
    border: none;
    border-radius: 0;
    cursor: pointer;
    font-size: 12px;
    color: $primary-color !important;
    padding: 0 !important;
    min-width: 38px;
    border-radius: 4px;
    background-color: transparent !important;
}

.search_results {
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    border-radius: 0 0 2px 2px;
    background-color: $white;
    top: calc(100% + 1px);
    left: 0px;
    font-size: 12px;
    color: #333;
    border: 2px solid $bg-light;
    box-shadow: $box-shadow;
}

.no_result {
    padding: 15px 30px;
    display: flex;
    align-items: center;

    .icon {
        font-size: 22px;
        margin-right: 15px;
        opacity: 0.4;
    }
}

.search_result {
    border-bottom: 1px solid $bg-light;
    cursor: pointer;

    &:last-child {
        border-bottom: none;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

@if $VUE_APP_DEFAULT_NETWORKID == 5 {
    .search_input_wrapper {
        border: 1px solid $white;
    }
}

@include smOnly {
    .search_results {
        position: fixed;
    }
}
</style>
