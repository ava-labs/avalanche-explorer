import chroma from 'chroma-js'
import { IVersion } from '.'

/**
 * Excludes 'offline' nodes
 */
export function getVersionsOnly(peerInfo: IVersion[]) {
    return peerInfo.filter((i) => i.version !== 'offline')
}

/**
 * Maps major/minor versions to their patches (e.g. 1.0: [1.0.1, 1.0.0])
 * @param peerInfo
 */
export function versionsOnlyMap(peerInfo: IVersion[]) {
    const allVersions = getVersionsOnly(peerInfo).map((v) =>
        v.version.split('.')
    )
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

// categorical colorscale based on Explorer colors
const categorical = ['#4c2e56', '#e84970', '#2196f3', '#6bc688', '#ef8f4a']
export const lower = '#f5f6fa'
export const brightnessFactor = 0.5

/**
 * categorical and continuous colorscale for major.minor.patch versions
 * each major.minor version is a categorical color
 * patches follow a continuous scale of the categorical color
 * @param datamap
 */
export function getVersionsColorMap(datamap: any) {
    const colors: string[] = []
    const blah = []
    for (const key in datamap) {
        blah.push([key, datamap[key]])
    }
    blah.forEach((item, i) => {
        colors.push(categorical[i])
        for (let j = 1; j < item[1].length; j++) {
            colors.push(
                chroma(categorical[i])
                    .brighten(brightnessFactor * j)
                    .hex()
            )
        }
    })
    return colors
}

export function getTotalStake(peerInfo: IVersion[]) {
    const allVersions = getVersionsOnly(peerInfo)
    return allVersions
        .map((item) => item.stakeAmount)
        .reduce((acc, val) => acc + val)
}
