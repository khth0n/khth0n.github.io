import { WolframCA } from "./CellularAutomata";

type PRNGGen = (seed: number) => Generator<number, void, unknown>;

function* WolframPRNG(seed: number) {

    let ca_depth = 8;
    
    //BEWARE CHOOSING LESS THAN 23 WIDE
    //the number will converge to a s
    let ca_width = 23;

    let ca_strips = [];

    for(let i = 0; i < ca_width; i++) {

        ca_strips.push(0);
    }

    ca_strips[ Math.floor( ca_width / 2 ) ] = 1;

    const ca = new WolframCA({
        rule: 30,
        timestep: 0,
        depth: ca_depth,
        width: ca_width,
        strips: ca_strips
    });

    let skip_count: number = ca_depth - 1 + seed;
    let middle_value: number;
    let normalized_middle_value: number;

    let previous_step = 0;

    while(true) {

        ca.step( skip_count );

        middle_value = ca.init_state['strips'][ Math.floor( ca_width / 2 ) ];

        normalized_middle_value = middle_value / Math.pow(2, ca_depth);

        yield normalized_middle_value;

        //skip_count = ca_depth;

        //skip_count = Math.round( normalized_middle_value * ca_depth ) + 1;

        skip_count = 1 + Math.round(previous_step + seed) % (ca_depth + 1);

        previous_step = middle_value;


        //skip_count = Math.floor(Math.sqrt( ca.init_state['strips'][ leftOfMiddleIndex ] + ca.init_state['strips'][ rightOfMiddleIndex ] ))
    }
}

export const WolframPRNGGen: PRNGGen = (seed: number) => WolframPRNG(seed);
//export const WolframPRNGGen = WolframPRNG(19);