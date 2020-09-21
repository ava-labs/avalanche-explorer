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
    }
};

export default dict;
