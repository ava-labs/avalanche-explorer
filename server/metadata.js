const puppeteer = require('puppeteer')

let decoded = {
    address: null,
    name: null,
    abi: null,
    sourcecode: null,
    constructorArgs: null,
    deployedBytecode: null,
}

async function getMetadata(id) {
    decoded.address = id

    let result = await (async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(
            `https://cchain.explorer.avax.network/address/${id}/contracts`
        )
        // console.log('puppeteer page:      ', page)

        // CONTRACT NAME
        let name = await page.$eval(
            'strong.mr-4.mb-2.text-dark',
            (el) => el.title
        )
        decoded.name = name ? name : null
        // console.log('name:          ', name)

        // SOURCECODE
        let sourcecode = await page.$eval('#button', (el) => {
            return el.getAttribute('data-clipboard-text')
        })
        decoded.sourcecode = sourcecode ? sourcecode : null
        // console.log('sourcecode:          ', sourcecode)

        // CONSTRUCTOR ARGS, ABI, BYTECODE
        let sources = await page.$$eval('code.nohighlight', (els) =>
            els.map((el) => el.textContent)
        )
        decoded.constructorArgs = sources[0] ? sources[0] : null
        decoded.abi = sources[1] ? sources[1] : null
        decoded.deployedBytecode = sources[2] ? sources[2] : null
        // console.log('sources:       ', sources)

        await browser.close()
        return decoded
    })()
    return result
}

module.exports = { decoded, getMetadata }
