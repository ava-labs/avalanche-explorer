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
            constructorArgs: null,
            sourcecode: null,
            abi: null,
            deployedBytecode: null,
        }
        try {
            const result = await page.goto(
                `https://cchain.explorer.avax.network/address/${id}/contracts`
            )
            if (result.status() === 200) {
                console.error('200 status code found in result')
                // CONTRACT NAME
                const name = await page.$eval(
                    'strong.mr-4.mb-2.text-dark',
                    (el) => el.title
                )
                decoded.name = name ? name : null
                console.log('name:          ', name)

                // QUERY FOR SOURCES - key is <header>, content is in <btn> or <code>
                const queries = await page.$$eval(
                    '.d-flex.justify-content-between.align-items-baseline',
                    (els) => {
                        return els
                            .map((el) => {
                                const header = el.children[0].innerHTML
                                const content =
                                    el.children[1] !== undefined
                                        ? el.children[1].getAttribute(
                                              'data-clipboard-text'
                                          )
                                        : el.nextElementSibling.children[0]
                                              .children[0].innerText

                                return [header, content]
                            })
                            .filter((el) => el[1] !== null)
                    }
                )

                // SOURCECODE
                const sc = queries.find((s) => s[0] === 'Contract source code')
                decoded.sourcecode = sc ? sc[1] : null

                // ABI
                const abi = queries.find((s) => s[0] === 'Contract ABI')
                decoded.abi = abi ? abi[1] : null

                // DEPLOYED BYTECODE
                const db = queries.find((s) => s[0] === 'Deployed ByteCode')
                decoded.deployedBytecode = db ? db[1] : null

                // CONSTRUCTOR ARGS
                const ca = queries.find((s) => s[0] === 'Constructor Arguments')
                decoded.constructorArgs = ca ? ca[1] : null
            }
            if (result.status() === 404) {
                console.error('404 status code found in result')
            }
        } catch (err) {
            console.error('Error thrown:', err)
        }
        return decoded
    })()
    // await browser.close()
}

module.exports = { getMetadata }
