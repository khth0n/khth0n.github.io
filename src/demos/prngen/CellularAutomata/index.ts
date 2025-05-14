const workerURL = new URL('./worker', import.meta.url);



function createWorkers(count: number, source: URL) {

    let workers: Worker[] = [];

    for(let i = 0; i < count; i++) {

        workers.push( new Worker( source, { type: 'module' }) );
    }

    return workers;
}

function work(worker: Worker, data: any): Promise<unknown> {

    return new Promise((resolve, reject) => {
        
        worker.onmessage = resolve;
        worker.postMessage( data );
    });
}

async function performWork() {

    let data = {
        workerID: 0
    };

    const workers = createWorkers(8, workerURL);

    const promisedWork = workers.map( (value: Worker, index: number) => {

        data['workerID'] = index;

        return work( value, data );
    });

    await Promise.all( promisedWork );

    console.log('All messages received from workers!');
}

performWork();

export const test = 0;