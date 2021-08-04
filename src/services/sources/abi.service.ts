/**
 *
 * @param id name of Ethereum interface
 * @returns hardcoded ABI of common ERC interface
 */
export async function getABI(id: string) {
    const res: any = await fetch(`/abi/${id}.json`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => data)
    return res
}
