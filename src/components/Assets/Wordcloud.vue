<template>
    <wordcloud
        v-if="assetsLoaded"
        :data="assetNames"
        name-key="name"
        value-key="value"
        :color="myColors"
        :show-tooltip="true"
        :word-click="wordClickHandler"
    >
    </wordcloud>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
//@ts-ignore
import wordcloud from 'vue-wordcloud'

@Component({
    components: { wordcloud },
})
export default class AssetWordcloud extends Vue {
    @Prop() data!: any[]

    myColors: string[] = ['#1f77b4', '#629fc9', '#94bedb', '#c9e0ef']

    //@ts-ignore
    wordClickHandler(name, value, vm) {
        console.log('wordClickHandler', name, value, vm)
    }
}
</script>
