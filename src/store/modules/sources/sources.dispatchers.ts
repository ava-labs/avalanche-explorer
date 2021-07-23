import store from '@/store'
import { SOURCES_NAMESPACE } from './sources.constants'

export enum SOURCESACTION {
    GET_ABIDECODER = 'getABIDecoder',
}

export function dispatchGetABIDecoder() {
    return store.dispatch(
        `${SOURCES_NAMESPACE}/${SOURCESACTION.GET_ABIDECODER}`
    )
}
