import { AxiosResponse } from 'axios'

export function resolveResponseData<T = any>(res: AxiosResponse<T>) {
    return res.data
}
