interface VMDict {
    [key: string]: IVirtualMachine
}

interface IVirtualMachine {
    name: string,
    documentation: string
}

let dict: VMDict = {
    "": {
        name: "platformvm",
        documentation: "https://docs.avax.network/v1.0/en/api/platform/"
    },
    "jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq": {
        name: "avm",
        documentation: "https://docs.avax.network/v1.0/en/api/avm/"
    },
    "mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6": {
        name: "evm",
        documentation: "https://docs.avax.network/v1.0/en/api/evm/"
    },
    "tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH": {
        name: "timestampvm",
        documentation: "https://docs.avax.network/v1.0/en/api/timestamp/"
    },
    "sqjchUjzDqDfBPGjfQq2tXW1UCwZTyvzAWHsNzF2cb1eVHt6w": {
        name: "spchainvm",
        documentation: "https://docs.avax.network/v1.0/en/core-concepts/overview/#what-are-virtual-machines"
    },
    "sqjdyTKUSrQs1YmKDTUbdUhdstSdtRTGRbUn8sqK8B6pkZkz1": {
        name: "spdagvm",
        documentation: "https://docs.avax.network/v1.0/en/core-concepts/overview/#what-are-virtual-machines"
    }
};

export default dict;
