import delay from './delay';

export type OptionsType = {
  onopen?: (Event: Event) => void;
  onerror?: (Event: Event) => void;
  onclose?: (Event: Event) => void;
  // 规则队列 规则顺序产出watchKey
  rules: Array<(data: any) => string | string[] | false>;
};

const randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)
    .split('')
    .join('.');

export default class Ws {
  private ws: WebSocket;

  private options: OptionsType = {
    rules: [(data: string) => data],
  };

  private msgQueue: Array<any> = [];

  private INIT_WHATCH_KEY: string = `@ws/INIT${randomString()}`;

  private watchMsgKeys: {
    [key: string]: (data: any) => any;
  } = {
    [this.INIT_WHATCH_KEY]: (msgBody: any) => console.log(this.INIT_WHATCH_KEY, msgBody),
  };

  private isReception: boolean = false;

  constructor(url: string, options: OptionsType) {
    this.ws = new WebSocket(url);
    this.options = {
      ...options,
    };

    this.ws.onopen = this.options?.onopen || (e => console.log(e));
    this.ws.onclose = this.options?.onclose || (e => console.log(e));
    this.ws.onerror = this.options?.onerror || (e => console.log(e));
    this.ws.onmessage = this.subscribe;
  }

  private subscribe = async (e: any) => {
    this.msgQueue[this.msgQueue.length] = e.data;

    this.msgReceptionStart();
  };

  private msgReceptionStart = async () => {
    if (this.isReception) return;

    this.isReception = true;

    while (this.msgQueue.length) {
      const msgBody = this.msgQueue.shift();

      const watchKeys = await this.filterRule(msgBody);

      watchKeys.forEach(key => this.watchMsgKeys[key || this.INIT_WHATCH_KEY](msgBody));
    }

    this.isReception = false;
  };

  private filterRule = async (data: any): Promise<Array<string>> => {
    const ruleFilters = [...this.options.rules];

    let watchKeys: string[] = [];

    while (ruleFilters.length) {
      const rule = ruleFilters.shift();

      await delay();

      const ruleResult = rule!(data);

      if (ruleResult) {
        watchKeys = watchKeys.concat(Array.isArray(ruleResult) ? ruleResult : [ruleResult]);
      }
    }

    return watchKeys;
  };

  readonly onmessage = (watchKey: string, watchCallback: (data: any) => any) =>
    (this.watchMsgKeys[watchKey] = watchCallback);

  readonly send = async (content: ArrayBuffer | string | Blob, cb?: Function) => {
    try {
      this.ws.send(content);
    } catch (err) {
      if (cb) {
        cb(err);
      } else {
        await delay(1000);

        this.send(content);
      }
    }
  };

  readonly close = () => {
    this.ws.close();
  };
}
