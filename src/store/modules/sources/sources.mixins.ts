import { Vue, Component } from 'vue-property-decorator'
import { getABIsLoaded, getABIs, getABIDecoder } from './sources.getters'

@Component
export class SourcesGettersMixin extends Vue {
    getABIsLoaded() {
        return getABIsLoaded()
    }

    getABIs() {
        return getABIs()
    }

    getABIDecoder() {
        return getABIDecoder()
    }
}
