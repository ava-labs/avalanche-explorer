<template>
    <div class="card request_error" :margin="isMargin">
        <h2><slot></slot></h2>
        <p>Status {{ status }} - {{ message }}</p>
        <p>
            <a :href="supportURL" target="_blank">Submit Issue</a>
        </p>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class HTTPError extends Vue {
    @Prop() status!: number
    @Prop() message!: string
    @Prop() supportURL!: string
    @Prop() isMargin!: boolean
}
</script>

<style scoped lang="scss">
.request_error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;

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
        font-family: 'DM Sans', sans-serif;
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
    margin-top: 30px;
}
</style>
