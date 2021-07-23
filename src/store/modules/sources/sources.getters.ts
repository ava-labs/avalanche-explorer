import store from '@/store'

export function getABIsLoaded() {
    return store.state.Sources.abisLoaded
}

export function getABIs() {
    return store.state.Sources.abis
}

export function getABIDecoder() {
    return store.state.Sources.abiDecoder
}
