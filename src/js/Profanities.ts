//@ts-ignore
import * as cuss from 'cuss'
import { expletives } from '@/expletives'

class Profanities {
    expletives: string[]
    cusses: string[]

    constructor() {
        this.expletives = expletives
        this.cusses = this.getCusses()
    }

    screen(input: string): boolean {
        const value = input.toLowerCase()
        let profane = false

        // CHECK #1 - short list of unambiguous profanities
        for (const expletive of this.expletives) {
            // partial match ("****shit", "******fuck**")
            if (value.includes(expletive)) {
                profane = true
                break
            }
        }

        // CHECK #2 - longer list
        if (!profane) {
            const values = value.split(' ') // "ass coin"
            for (const value of values) {
                for (const cuss of this.cusses) {
                    if (value.includes(cuss)) {
                        // partial match - long words ("asshole")
                        if (cuss.length > 4) {
                            profane = true
                            break
                        }
                        // exact match - short words ("ass" vs. "glass")
                        if (value === cuss) {
                            profane = true
                            break
                        }
                    }
                }
            }
        }
        return profane
    }

    private getCusses() {
        const cusses: string[] = []
        // profanities with a high sureness rating
        for (const [key, value] of Object.entries(cuss.default)) {
            if ((value as number) > 1) {
                cusses.push(key)
            }
        }
        cusses.sort((a, b) => a.length - b.length)
        return cusses
    }
}

const profanities = new Profanities()
export { profanities }
