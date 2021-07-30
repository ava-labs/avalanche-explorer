export async function getVerifiedContract(id: string) {
    const res: any = await fetch(`/api/metadata/${id}`, {
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
