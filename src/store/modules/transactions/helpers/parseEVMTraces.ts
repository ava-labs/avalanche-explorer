import { TraceResponse } from '../models'

export function parseEVMTraces(traces: TraceResponse[]) {
    if (!traces) return []

    const graph: any = []

    // the root trace is the outermost function call
    // this is the transaction itself
    graph[0] = traces.shift()
    graph[0].children = []

    // This reducer converts the flat list of function traces to a graph structure
    const grapher = (root: any, currentValue: any) => {
        // for each trace, init a list to store children
        currentValue.children = []

        // the second-to-last traceAddress is the trace's parent (execution context)
        const beforeLast =
            currentValue.traceAddress[currentValue.traceAddress.length - 1 - 1]

        // if no parent, insert trace into the root
        if (!beforeLast) {
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

    const traceGraph = [traces.reduce(grapher, graph[0])]
    return traceGraph
}
