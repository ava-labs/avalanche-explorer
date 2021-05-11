<template>
    <div v-if="display" class="page_loader">
        <transition-group name="fade">
            <div key="0" class="quote_container">
                <img src="@/assets/yeti_grover_logo.png" />
                <div class="quote">
                    "{{ quote.quote }}"
                    <br />
                    - {{ quote.author }}
                </div>
            </div>
            <v-progress-circular
                key="1"
                :size="16"
                :width="2"
                color="#E84970"
                indeterminate
            />
            <div key="2" class="message">{{ message }}</div>
            <div v-if="contentId" key="3" class="content_id">
                {{ contentId }}
            </div>
        </transition-group>
    </div>
</template>

<script>
import { getRandomQuote } from '../../helper'

export default {
    props: {
        contentId: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            display: false,
        }
    },
    computed: {
        quote() {
            return getRandomQuote()
        },
    },
    created() {
        // assign debounce here (not in methods)
        this.debounceShow = this.debounce(this.show, 500)
        this.debounceShow()
    },
    methods: {
        show() {
            this.display = true
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
    },
}
</script>

<style scoped lang="scss">
.page_loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0;
    overflow: auto;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
}

img {
    width: auto;
    height: 150px;
    object-fit: contain;
    padding-bottom: 30px;
}

.quote_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    white-space: initial;
    text-overflow: wrap;
    margin: 30px 0 30px;
}

.quote {
    font-weight: 400;
    font-size: 36px;
    line-height: 1.25em;
    max-width: 800px;
}

.message {
    margin: 12px 0 0.5em;
    font-size: 16px;
    color: $primary-color;
}

.content_id {
    font-size: 16px;
    color: $primary-color;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter, 
.fade-leave-to 
/* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

@include smOnly {
    .quote_container {
        margin-top: 15px;
    }

    img {
        height: 100px;
        padding-bottom: 20px;
    }

    .quote {
        font-size: 24px;
        max-width: 500px;
    }
}

@include xsOrSmaller {
    .quote_container {
        margin-top: 0;
    }

    img {
        height: 75px;
        padding-bottom: 10px;
    }

    .quote {
        font-size: 20px;
        max-width: 350px;
    }

    .message {
        margin: 12px 0 0.5em;
        font-size: 12px;
    }

    .content_id {
        font-size: 12px;
    }
}
</style>
