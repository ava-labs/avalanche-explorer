// import { CanonicSignature, getSignature } from '@/services/sources'
import { TraceResponse } from '../models'
import { DecodedContractMap } from '@/store/modules/sources/models'
/*
async function getPossibleSigs(trace: TraceResponse): Promise<string[]> {
    if (trace.input === undefined) {
        return []
    }
    const res = await getSignature(trace.input.substring(0, 10))
    // console.log('   methodID        ', trace.input.substring(0, 10))
    const possibleSigs = res.results.map((result: CanonicSignature) => {
        // console.log('       could be:   ', result.text_signature)
        return result.text_signature
    })
    return possibleSigs
}
*/

/**
 * inits a list to store children and adds props for UI
 * */
async function dressTrace(
    trace: TraceResponse,
    txInput: string,
    verifiedContracts: DecodedContractMap
) {
    console.log('verifiedContracts:     ', verifiedContracts)
    console.log(Object.keys(verifiedContracts).length)
    console.log('does it have key?', verifiedContracts[trace.to])
    return {
        ...trace,
        children: [],
        id: trace.traceAddress ? trace.traceAddress.toString() : txInput,
        possibleSignatures: [],
        // possibleSignatures: await getPossibleSigs(trace),
        name: verifiedContracts[trace.to]
            ? verifiedContracts[trace.to].name
            : null,
    }
}

export async function parseEVMTraces(
    traces: TraceResponse[],
    txInput: string,
    verifiedContracts: DecodedContractMap
) {
    if (!traces) return []

    const graph: any = []

    // the root trace is the outermost function call
    // this is the transaction itself
    graph[0] = traces.shift()
    graph[0] = await dressTrace(graph[0], txInput, verifiedContracts)

    // This reducer converts the flat list of function traces to a graph structure
    const grapher = async (rootP: Promise<any>, currentValue: any) => {
        const root = await rootP
        currentValue = await dressTrace(
            currentValue,
            txInput,
            verifiedContracts
        )

        // the second-to-last traceAddress is the trace's parent (where the function was called)
        const beforeLast =
            currentValue.traceAddress[currentValue.traceAddress.length - 1 - 1]

        // if no parent, insert trace into the root
        if (beforeLast === undefined) {
            root.children.push(currentValue)
        }
        // find the parent
        else {
            // The traceAddress list shows us the positions for the call graph:
            // [0,      0,       2,        0]
            //                   ^parent   ^trace

            // find depth of parent
            const depth = currentValue.traceAddress.length - 1
            let ancestor
            let parent = root
            // walk the graph to get to the parent
            for (let i = 0; i < depth; i++) {
                ancestor = parent
                parent = ancestor.children[currentValue.traceAddress[i]]
            }
            // insert trace into the parent
            parent.children.push(currentValue)
        }
        return root
    }

    const traceGraph = [await traces.reduce(grapher, Promise.resolve(graph[0]))]
    return traceGraph
}
