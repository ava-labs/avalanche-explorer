import { IVersion } from '.'

// Excludes 'offline' nodes
export function getVersions(peerInfo: IVersion[]) {
    return peerInfo.filter((i) => i.version !== 'offline')
}

/**
 * Maps major/minor versions to their patches (e.g. 1.0: [1.0.1, 1.0.0])
 * @param peerInfo
 */
export function getVersionMap(peerInfo: IVersion[]) {
    const allVersions = getVersions(peerInfo).map((v) => v.version.split('.'))
    const uniqueVersions = allVersions
        .map((v) => v[0] + '.' + v[1])
        .filter((item, i, ar) => ar.indexOf(item) === i)
    const patches = allVersions.map((v) => [v[0] + '.' + v[1], v[2]])
    const versions = {} as any
    uniqueVersions.forEach((version) => {
        const patchesForVersion = patches.filter(
            (patch) => patch[0] === version
        )
        versions[version] = patchesForVersion.map(
            (item) => item[0] + '.' + item[1]
        )
    })
    return versions
}
