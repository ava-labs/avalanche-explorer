<template>
    <div class="card request_error" :margin="isMargin">
        <h2>{{ title }}</h2>
        <p class="message">
            <template v-if="status">
                Status {{ status }} - {{ message }}
            </template>
            <template v-else>
                {{ message }}
            </template>
        </p>
        <p class="copy_id">
            {{ id }}
            <CopyText :value="`${id}`" class="copy_but"></CopyText>
        </p>
        <p>
            <a :href="supportURL" target="_blank">Submit Issue</a>
        </p>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import CopyText from '@/components/misc/CopyText.vue'

@Component({
    components: { CopyText },
})
export default class HTTPError extends Vue {
    @Prop() title!: string
    @Prop() status?: number
    @Prop() message?: string
    @Prop() id!: string
    @Prop() supportURL!: string
    @Prop() isMargin?: boolean
}
</script>

<style scoped lang="scss">
.request_error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    h2 {
        font-weight: 400;
        font-size: 36px;
        line-height: 1.25em;
    }

    .message {
        margin: 0 0 2em;
        font-size: 16px;
        color: $primary-color;
    }

    .copy_id {
        font-size: 16px;
        color: $primary-color-light;
    }

    a {
        display: block;
        width: max-content;
        text-decoration: none !important;
        margin-top: 30px;
        transition: opacity 0.3s;

        background-color: transparent !important;
        color: $secondary-color !important;
        padding: 10px 24px;

        border-radius: 6px;
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase !important;
        font-size: 14px;

        &:hover {
            opacity: 0.9;
        }
    }
}

.request_error[margin] {
    margin: 30px 0;
}
</style>
