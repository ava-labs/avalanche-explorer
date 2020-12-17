const axios = require('axios')
const URL = 'https://explorerapi.avax.network/validators'

let versions = {
    peerInfo: [],
}

function updateVersions() {
    axios
        .get(URL)
        .then((res) => {
            console.log('res', res)
            versions = {
                momo: 'momo2',
            }
            return res.text()
        })
        .then((text) => {
            versions.peerinfo = text
                .split('peerinfo')
                .filter((x) => x.slice(1, -1))
                .map((y) => {
                    return y
                        .slice(1, -1)
                        .split(',')
                        .reduce((acc, curr) => {
                            return {
                                ...acc,
                                [curr.split('=')[0]]: curr.split('=')[1],
                            }
                        }, {})
                })
                .map((y) => {
                    return {
                        version: y.version.slice(1, -1),
                        nodeCount: parseInt(y.nodeCount),
                        stakeAmount: parseInt(y.stakeAmount),
                    }
                })
        })
}

module.exports = {
    versions,
    updateVersions,
}
