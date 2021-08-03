import { DecodedContractResponse } from '.'

/**
 *
 * @param id
 * @returns verified contract data
 */
export async function getVerifiedContract(id: string) {
    const res: DecodedContractResponse = await fetch(`/api/metadata/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('source service:    ', data)
            return data
        })
    return res
}
