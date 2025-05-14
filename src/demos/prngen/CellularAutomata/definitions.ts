
import { Dictionary } from "../Dictionary";

export abstract class CAFramework {
     
    state: Dictionary;

    constructor( state: Dictionary ) {

        this.state = state;
    }

    seed( state: Dictionary ) {

        this.state = state;
    }

    abstract reset(): void;

    abstract step( step_count?: number ): void;

    abstract snapshot(): Dictionary;
}

export type WolframCAData = {

    rule: number;
    timestep: number;

    depth: number;
    width: number;

    strips: number[];
}

 export class WolframCA extends CAFramework {

    key: boolean[];

    constructor(
        {
            rule,
            timestep,
            depth,
            width,
            strips
        }: Dictionary
    ) {
        super({
            rule,
            timestep,
            depth,
            width,
            strips
        });

        this.key = [];

        for(let i = 0x80; i >= 1; i >>= 1) {

            //console.log(i);

            if( rule >= i ) {

                rule -= i;
                this.key.push( true );
                continue;
            }

            this.key.push(false);
        }
        
        this.key.reverse();

        //console.log( this.key );
    }

    reset() {

        throw new Error("Method not implemented.");
    }

    private apply_rule(strips: number[], strip: number, offset: number, width: number) {

        let left = strip - 1;
        let right = strip + 1;

        if(left < 0) {

            left = width - 1;
        }

        if(right >= width) {

            right = 0;
        }

        let neighborhood = 0;

        neighborhood |= (strips[ left ] & ( 1 << offset )) > 0 ? 1 << 2 : 0;
        neighborhood |= (strips[ strip ] & ( 1 << offset )) > 0 ? 1 << 1 : 0;
        neighborhood |= (strips[ right ] & ( 1 << offset )) > 0 ? 1 << 0 : 0;

        return this.key[ neighborhood ];
    } 

    step( step_count: number = 1 ) {

        if( step_count <= 0 ) {

            return;
        }

        this.state['timestep']++;

        let { timestep, depth, width, strips } = this.state;

        let previous_step = (timestep - 1) % depth;
        let current_step = timestep % depth;

        for(let i = 0; i < width; i++) {

            if( this.apply_rule( strips, i, previous_step, width ) ) {

                strips[i] |= (1 << current_step);
            } else {

                strips[i] &= ~(1 << current_step);
            }
        }

        //console.log( this.state['strips']);

        //this.print_state();

        this.step( step_count - 1 );
    }

    print_state() {

        const { timestep, depth, width, strips } = this.state;

        let state = '';

        for(let j = 0; j < depth; j++) {

            for(let i = 0; i < width; i++) {

                state += (strips[i] & (1 << j)) > 0 ? '⬜' : '⬛';
            }

            state += '\n';
        }

        console.log(state);
    }

    snapshot(): Dictionary {
        throw new Error("Method not implemented.");
    }
}