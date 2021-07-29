const puppeteer = require('puppeteer')

let decoded = {
    address: null,
    name: null,
    abi: null,
    sourcecode: null,
    deployedBytecode: null,
}

async function getMetadata(id) {
    let result = await (async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(
            `https://cchain.explorer.avax.network/address/${id}/contracts`
        )
        // console.log('puppeteer page:      ', page)
        let sources = await page.$$eval('code.nohighlight', (elements) =>
            elements.map((element) => element.textContent)
        )
        // console.log('puppeteer sources:      ', sources)
        // await browser.close()
        decoded.address = id
        decoded.sourcecode = sources[0]
        decoded.abi = sources[1]
        decoded.deployedBytecode = sources[2]
        return decoded
    })()
    return result
}

module.exports = { decoded, getMetadata }
