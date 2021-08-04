const puppeteer = require('puppeteer')

async function getMetadata(id) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    console.log('WHAT IS THE ID?', id)

    return await (async () => {
        let decoded = {
            address: id,
            name: null,
            abi: null,
            sourcecode: null,
            constructorArgs: null,
            deployedBytecode: null,
        }
        // console.log('puppeteer page:      ', page)

        try {
            let result = await page.goto(
                `https://cchain.explorer.avax.network/address/${id}/contracts`
            )
            console.info('No error thrown')
            if (result.status() === 200) {
                console.error('200 status code found in result')
                // CONTRACT NAME
                let name = await page.$eval(
                    'strong.mr-4.mb-2.text-dark',
                    (el) => el.title
                )
                decoded.name = name ? name : null
                console.log('name:          ', name)

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
            }
            if (result.status() === 404) {
                console.error('404 status code found in result')
            }
        } catch (err) {
            console.error('Error thrown')
        }
        return decoded
    })()
    await browser.close()
}

module.exports = { getMetadata }
