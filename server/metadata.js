const puppeteer = require('puppeteer')

async function getMetadata(id) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    page.on('console', (msg) => console.log('PAGE LOG:', msg))

    console.log('======================================')
    console.log('ID:            ', id)

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
            if (result.status() === 200) {
                console.error('200 status code found in result')
                // CONTRACT NAME
                let name = await page.$eval(
                    'strong.mr-4.mb-2.text-dark',
                    (el) => el.title
                )
                decoded.name = name ? name : null
                console.log('name:          ', name)

                // CONSTRUCTOR ARGS, ,
                let sections = await page.$$eval(
                    '.d-flex.justify-content-between.align-items-baseline',
                    (els) => {
                        return els.map((el) => {
                            let header = el.children[0].innerHTML
                            let content = el.children[1].getAttribute(
                                'data-clipboard-text'
                            )
                            // return header
                            return [header, content]
                        })
                    }
                )
                // console.log('section:      ', sections)

                // decoded.constructorArgs = sections.find(section => section[0] === )

                // SOURCECODE
                const sourcecode = sections.find(
                    (s) => s[0] === 'Contract source code'
                )
                decoded.sourcecode = sourcecode ? sourcecode[1] : null
                // ABI
                const abi = sections.find(
                    (section) => section[0] === 'Contract ABI'
                )
                decoded.abi = abi ? abi[1] : null
                // DEPLOYED BYTECODE
                const deployedBytecode = sections.find(
                    (section) => section[0] === 'Deployed ByteCode'
                )
                decoded.deployedBytecode = deployedBytecode
                    ? deployedBytecode[1]
                    : null
                // CONSTRUCTOR ARGS
            }
            if (result.status() === 404) {
                console.error('404 status code found in result')
            }
        } catch (err) {
            console.error('Error thrown:', err)
        }
        return decoded
    })()
    await browser.close()
}

module.exports = { getMetadata }
