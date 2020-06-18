//@ts-ignore
import * as cuss from 'cuss';
import { expletives } from "@/expletives";

export class Profanities {
    expletives: string[];
    cusses: string[];

    constructor() {
        this.expletives = expletives;
        this.cusses = this.getCusses();
    }

    screen(input: string): boolean {
        let value = input.toLowerCase();
        let profane = false;

        // CHECK #1 - short list of unambiguous profanities
        for (let expletive of this.expletives) {
            // partial match ("****shit", "******fuck**")
            if (value.includes(expletive)) {
                profane = true;
                break;
            }
        }

        // CHECK #2 - longer list
        if (!profane) {
            let values = value.split(" "); // "ass coin"
            for (let value of values) {
                for (let cuss of this.cusses) {
                    if (value.includes(cuss)) {
                        // partial match - long words ("asshole")
                        if (cuss.length > 4) {
                            profane = true;
                            break;
                        }
                        // exact match - short words ("ass" vs. "glass")
                        if (value === cuss) {
                            profane = true;
                            break;
                        }
                    }
                }
            }
        }
        return profane;
    }

    private getCusses() {
        let cusses: string[] = [];
        // profanities with a high sureness rating
        for (let [key, value] of Object.entries(cuss.default)) {
            if ((value as number) > 1) {
                cusses.push(key);
            }
        }
        cusses.sort((a, b) => a.length - b.length);
        return cusses;
    }
}
