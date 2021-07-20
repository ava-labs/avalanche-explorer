import { TraceResponse } from '../models'

// inits a list to store children
// adds props for UI
function dressTrace(trace: TraceResponse, txInput: string) {
    return {
        ...trace,
        children: [],
        id: trace.traceAddress ? trace.traceAddress.toString() : txInput,
        name: `${trace.callType} | ${trace.type} (${trace.input} => ${trace.output})`,
    }
}

export function parseEVMTraces(traces: TraceResponse[], txInput: string) {
    if (!traces) return []

    const graph: any = []

    // the root trace is the outermost function call
    // this is the transaction itself
    graph[0] = traces.shift()
    graph[0] = dressTrace(graph[0], txInput)

    // This reducer converts the flat list of function traces to a graph structure
    const grapher = (root: any, currentValue: any) => {
        currentValue = dressTrace(currentValue, txInput)

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

    const traceGraph = [traces.reduce(grapher, graph[0])]
    return traceGraph
}
