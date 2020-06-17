const createNetwork = (targetFun: Function) => {
  onmessage = (e: MessageEvent) => {
    const  { message } = e.data;

    const targetResult = targetFun(message);

    postMessage({result: targetResult});
  };
}

const initWorker = (targetFun: Function, callback: Function): Function => {
  const networkText = createNetwork.toString();
  const IIFE = `(${networkText})(${targetFun.toString()})`;
  const blobData = new Blob([IIFE])
  const blobUrl = URL.createObjectURL(blobData);
  const worker = new Worker(blobUrl);

  worker.onmessage = ({data: { result }}): void => callback(result);

  return (message: string) => worker.postMessage({message});
}

export default initWorker;
