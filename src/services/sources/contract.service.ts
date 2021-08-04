import { DecodedContractResponse } from '.'

/**
 *
 * @param id the address of the contract
 * @returns ABI, source code, and other data of the verified contract
 */
export async function getVerifiedContract(id: string) {
    const res: DecodedContractResponse = await fetch(`/api/metadata/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            return data
        })
    return res
}
