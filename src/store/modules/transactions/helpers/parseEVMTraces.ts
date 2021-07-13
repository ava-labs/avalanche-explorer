import { TraceResponse } from '../models'

export function parseEVMTraces(traces: TraceResponse[]) {
    if (!traces) return []

    const graph: any = []
    let root

    traces.forEach((t) => {
        if (!t.traceAddress) {
            root = t
            graph.push(root)
        }
        console.log('-------------------')
        console.log('t.traceAddress     ', t.traceAddress)
        // console.log('t.from             ', t.from)
        // console.log('t.to               ', t.to)
    })

    console.log('graph', graph)
    return traces
}
