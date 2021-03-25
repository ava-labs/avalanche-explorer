<template>
    <div class="search_bar">
        <v-btn color="#FFF" :loading="isAjax" depressed @click="search">
            <fa icon="search"></fa>
        </v-btn>
        <input
            ref="input"
            v-model="searchValue"
            type="text"
            :placeholder="placeholder"
            @keyup.enter="search"
            @input="oninput"
            @focus="onfocus"
            @blur="onblur"
        />
        <v-btn icon @click="closeSearch">
            <fa icon="times"></fa>
        </v-btn>
        <transition name="fade">
            <div v-if="showResults" class="search_results">
                <div v-if="isAjax" class="no_result">
                    <p>Searching...</p>
                </div>
                <div v-else>
                    <div v-if="results.length === 0" class="no_result">
                        <p class="icon">
                            <fa icon="snowman"></fa>
                        </p>
                        <p>No Results Found</p>
                    </div>
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
    mounted() {
        this.$nextTick(() => {
            this.focus()
        })
    },
    methods: {
        focus() {
            this.$refs.input.focus()
        },
        onfocus() {
            // display previous results, if any
            if (this.searchValue.length > 0) {
                this.showResults = true
            }
        },
        onblur() {
            // this.showResults = false;
        },
        search() {
            if (!this.canSearch) return
            this.$emit('search', this.searchValue)
        },
        oninput() {
            this.$emit('input', this.searchValue)
            this.debounceSearch()
        },
        autoSearch() {
            const parent = this
            let query = this.searchValue
            const SEARCH_LIM = 5

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
                    parent.results = data.results
                    parent.isAjax = false
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
            this.closeSearch()
        },
        closeSearch() {
            this.isAjax = false
            this.searchValue = ''
            this.showResults = false
            this.$emit('change', false)
        },
    },
})
</script>

<style scoped lang="scss">
.search_bar {
    display: flex;
    background-color: transparent;
    position: relative;
}

input {
    background-color: transparent;
    color: #333;
    padding: 8px 13px 8px 0;
    flex-grow: 1;
    outline: none;
    border: none;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
}

.v-btn {
    border: none;
    border-radius: 0;
    cursor: pointer;
    font-size: 12px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: 0;
    color: $gray-input;
}

.v-btn:not(.v-btn--round).v-size--default {
    padding: 0;
    min-width: 36px;
}

.search_results {
    position: absolute;
    width: 100%;
    height: calc(100vh - 56px);
    overflow: auto;
    box-sizing: border-box;
    border-radius: 0 0 2px 2px;
    background-color: $white;
    top: 56px;
    left: 0px;
    font-size: 12px;
    color: $black;
}

.no_result {
    padding: 10px 8px;
    display: flex;
    align-items: center;

    .icon {
        font-size: 22px;
        margin-right: 15px;
        opacity: 0.4;
    }
}

.search_result {
    border-bottom: 1px solid $gray-input;
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
</style>
