import { P } from '@/known_blockchains'

interface SubnetDict {
    [key: string]: string
}

const dict: SubnetDict = {}

dict[P.id] = 'Primary Network'

export default dict
