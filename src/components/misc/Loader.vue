<template>
    <div class="page_loader">
        <img src="@/assets/yeti_logo.png" />

        <div class="quote_container">
            <div class="quote">
                "{{quote.quote}}"
                <br />
                - {{quote.author}}
            </div>
        </div>
        <v-progress-circular :size="16" :width="2" color="#71c5ff" indeterminate></v-progress-circular>
        <div class="message ava-monospace">{{message}}</div>
        <div class="content_id ava-monospace">{{contentId}}</div>
    </div>
</template>

<script>
import { getRandomQuote } from "../../helper";

export default {
    props: {
        contentId: String,
        message: String
    },
    computed: {
        quote() {
            return getRandomQuote();
        }
    }
};
</script>

<style lang="scss">
@use '../../main';
.page_loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0;
    overflow: auto;
    white-space: nowrap;
    text-overflow: ellipsis;
}

img {
    width: auto;
    margin-right: 10px;
    height: 150px;
    object-fit: contain;
}

.quote_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    white-space: initial;
    text-overflow: wrap;
    margin: 30px 0 30px;
    text-align: center;
}

.quote {
    font-weight: 700;
    font-size: 48px;
    line-height: 1.25em;
    max-width: 800px;
}

.message {
    margin: 12px 0 0.5em;
    font-size: 16px;
    color: main.$blue;
}

.content_id {
    font-size: 16px;
    color: main.$blue;
}

@include main.device_sm {
    .page_loader {
        font-size: 18px;
    }

    img {
        margin-right: 5px;
        height: 100px;
    }

    .quote {
        font-size: 36px;
        max-width: 600px;
    }
}

@include main.device_xs {
    .page_loader {
        font-size: 12px;
    }
    
    img {
        margin-right: 2px;
        height: 75px;
    }

    .quote {
        font-size: 20px;
        max-width: none;
    }

    .message {
        margin: 12px 0 0.5em;
        font-size: 12px;
        color: main.$blue;
    }

    .content_id {
        font-size: 12px;
        color: main.$blue;
    }
}
</style>    