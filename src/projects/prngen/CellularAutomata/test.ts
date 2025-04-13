class Strip2D {

    strip_list_ref: number[];

    timestep: number;
    state: number;


    //which other neighbors does the child depend on inherently
    dependencies: number[];

    //semantically, which other neighbors does the child currently depend upon
    active_dependencies: Set<number>;

    constructor( timestep: number, state: number, dependencies: number[] = [], active_depedencies: Set<number> = null ) {

        this.timestep = timestep;
        this.state = state;

        this.dependencies = [];

        this.active_dependencies = new Set();

        for( let dependency of dependencies ) {

            this.dependencies.push( dependency );

            if( !active_depedencies ) {

                this.active_dependencies.add( dependency );
            }
        }
    }

    attempt_step(): boolean {

        if( !this.is_ready() ) return false;

        this.timestep++

        return true;
    }

    is_ready(): boolean {

        return this.active_dependencies.size == 0;
    }
}



export class ProtoCA {

    strips: Strip2D[];

    constructor() {

        this.strips = [];

        for( let i = 0; i < 13; i++ ) {


        }
    }
}