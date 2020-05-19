import Ws, { OptionsType } from './';

const wsMap: {
  [url: string]: Ws;
} = {};
export default (url: string, options?: OptionsType): Ws => {
  const ws = wsMap[url];

  if (ws) return ws;

  if (!options) {
    throw new Error('Create Ws not has options.rules');
  }

  wsMap[url] = new Ws(url, options);

  return wsMap[url];
};

export const queryWs: (url: string) => Ws | undefined = url => wsMap[url];

export const removeWs: (url: string) => void = url => {
  const ws = wsMap[url];

  if (!ws) return;

  ws.close();

  delete wsMap[url];
};
