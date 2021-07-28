let stub = {
    address: null,
    name: null,
    abi: null,
    sourcecode: null,
}
// start puppeteer
function getMetadata(id) {
    stub.address = id
    console.log(`getMetadata(${id})`)
    return stub
}

module.exports = { stub, getMetadata }
