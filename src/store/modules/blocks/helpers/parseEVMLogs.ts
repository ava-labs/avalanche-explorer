import { EVMBlockLog } from '../models'

export function parseLogs(logs: EVMBlockLog[] | null) {
    if (!logs) return []
    return logs
}
