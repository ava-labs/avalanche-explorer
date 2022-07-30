export const chunkRunner = (
    data: any[],
    chunkSize: number,
    timeout: number,
    callback: Function
) => {
    const numChunks = Math.ceil(data.length / chunkSize)
    for (let index = 0; index < numChunks; index++) {
        const chunk = data.slice(index * chunkSize, chunkSize * (index + 1))
        const isLastRun = index >= numChunks - 1

        setTimeout(() => {
            callback(chunk, isLastRun)
        }, timeout * index)
    }
}
