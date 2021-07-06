import { Vue, Component } from 'vue-property-decorator'
import { getEVMBlock } from './blocks.getters'

@Component
export class BlocksGettersMixin extends Vue {
    getEVMBlock() {
        return getEVMBlock()
    }
}
