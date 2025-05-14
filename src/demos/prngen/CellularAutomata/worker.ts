
onmessage = (e: MessageEvent) => {

    console.log(`Message received by worker ${ e.data['workerID'] }!`);

    console.log(e.data);

    postMessage( e.data );
}